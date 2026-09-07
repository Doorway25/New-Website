import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { prisma } from "../lib/prisma.js";
import { SEO_FIELDS, paginate, pick } from "../lib/utils.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler, HttpError } from "../middleware/error.js";
import { fetchYoutubeMeta } from "../lib/youtube.js";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../", process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!String(file.mimetype || "").startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) throw new HttpError(400, "Email and password required");
    const user = await prisma.adminUser.findUnique({ where: { email: String(email).toLowerCase() } });
    if (!user || !user.active) throw new HttpError(401, "Invalid credentials");
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  })
);

router.get(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, active: true },
    });
    if (!user || !user.active) throw new HttpError(401, "User not found");
    res.json(user);
  })
);

router.put(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, password, currentPassword } = req.body || {};
    const user = await prisma.adminUser.findUnique({ where: { id: req.user.id } });
    if (!user || !user.active) throw new HttpError(401, "User not found");

    const data = {};
    if (name !== undefined) data.name = String(name).trim() || user.name;

    if (password) {
      if (!currentPassword) throw new HttpError(400, "Current password required");
      const ok = await bcrypt.compare(String(currentPassword), user.passwordHash);
      if (!ok) throw new HttpError(400, "Current password is incorrect");
      if (String(password).length < 8) throw new HttpError(400, "New password must be at least 8 characters");
      data.passwordHash = await bcrypt.hash(String(password), 10);
    }

    const updated = await prisma.adminUser.update({
      where: { id: user.id },
      data,
      select: { id: true, email: true, name: true, role: true, active: true },
    });
    res.json(updated);
  })
);

router.post(
  "/auth/forgot-password",
  asyncHandler(async (req, res) => {
    const email = String(req.body?.email || "").toLowerCase().trim();
    if (!email) throw new HttpError(400, "Email required");

    const user = await prisma.adminUser.findUnique({ where: { email } });
    const payload = {
      ok: true,
      message: "If an account exists for that email, you can reset your password next.",
    };

    if (user?.active) {
      payload.resetToken = jwt.sign(
        { id: user.id, email: user.email, purpose: "password-reset" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    }

    res.json(payload);
  })
);

router.post(
  "/auth/reset-password",
  asyncHandler(async (req, res) => {
    const { token, password } = req.body || {};
    if (!token || !password) throw new HttpError(400, "Token and new password required");
    if (String(password).length < 8) throw new HttpError(400, "Password must be at least 8 characters");

    let decoded;
    try {
      decoded = jwt.verify(String(token), process.env.JWT_SECRET);
    } catch {
      throw new HttpError(400, "Invalid or expired reset link");
    }
    if (decoded.purpose !== "password-reset" || !decoded.id) {
      throw new HttpError(400, "Invalid reset link");
    }

    const user = await prisma.adminUser.findUnique({ where: { id: decoded.id } });
    if (!user || !user.active) throw new HttpError(400, "Account not found");

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(String(password), 10) },
    });

    res.json({ ok: true, message: "Password updated. You can sign in now." });
  })
);

router.use(requireAuth);

router.get(
  "/youtube-meta",
  asyncHandler(async (req, res) => {
    const raw = String(req.query.url || req.query.id || "").trim();
    if (!raw) throw new HttpError(400, "YouTube URL or ID required");
    try {
      const meta = await fetchYoutubeMeta(raw);
      res.json(meta);
    } catch (err) {
      throw new HttpError(err.status || 502, err.message || "YouTube lookup failed");
    }
  })
);

router.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    const [universities, articles, events, stories, branches, leads, countries, pages, recentLeads] =
      await Promise.all([
        prisma.university.count(),
        prisma.article.count(),
        prisma.event.count(),
        prisma.story.count(),
        prisma.branch.count(),
        prisma.lead.count({ where: { status: "new" } }),
        prisma.country.count(),
        prisma.page.count(),
        prisma.lead.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            email: true,
            createdAt: true,
          },
        }),
      ]);
    res.json({
      universities,
      articles,
      events,
      stories,
      branches,
      leads,
      countries,
      pages,
      recentLeads,
    });
  })
);

router.get(
  "/notifications",
  asyncHandler(async (_req, res) => {
    const leads = await prisma.lead.findMany({
      where: { status: "new" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        type: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true,
        status: true,
      },
    });
    res.json({
      items: leads.map((lead) => ({
        id: lead.id,
        type: "lead",
        title: `New ${lead.type || "enquiry"} from ${lead.name}`,
        body: lead.message || lead.email || lead.phone || "Open leads to review",
        href: "/leads",
        createdAt: lead.createdAt,
      })),
      unread: leads.length,
    });
  })
);

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const q = String(req.query.q || "").trim();
    if (q.length < 2) return res.json({ groups: [] });

    const [universities, articles, events, stories, branches, leads, pages] = await Promise.all([
      prisma.university.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, name: true, city: true },
      }),
      prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, title: true },
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, title: true },
      }),
      prisma.story.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { quote: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, name: true },
      }),
      prisma.branch.findMany({
        where: {
          OR: [
            { city: { contains: q, mode: "insensitive" } },
            { country: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, city: true, country: true },
      }),
      prisma.lead.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, name: true, email: true },
      }),
      prisma.page.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, title: true, slug: true },
      }),
    ]);

    const groups = [
      {
        key: "universities",
        label: "Universities",
        items: universities.map((u) => ({
          id: u.id,
          title: u.name,
          subtitle: u.city,
          href: `/universities/${u.id}`,
        })),
      },
      {
        key: "articles",
        label: "Articles",
        items: articles.map((a) => ({ id: a.id, title: a.title, href: `/articles/${a.id}` })),
      },
      {
        key: "events",
        label: "Events",
        items: events.map((e) => ({ id: e.id, title: e.title, href: `/events/${e.id}` })),
      },
      {
        key: "stories",
        label: "Stories",
        items: stories.map((s) => ({ id: s.id, title: s.name, href: `/stories/${s.id}` })),
      },
      {
        key: "branches",
        label: "Branches",
        items: branches.map((b) => ({
          id: b.id,
          title: b.city,
          subtitle: b.country,
          href: `/branches/${b.id}`,
        })),
      },
      {
        key: "pages",
        label: "Pages",
        items: pages.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: p.slug,
          href: `/pages/${p.id}`,
        })),
      },
      {
        key: "leads",
        label: "Leads",
        items: leads.map((l) => ({
          id: l.id,
          title: l.name,
          subtitle: l.email,
          href: "/leads",
        })),
      },
    ].filter((g) => g.items.length);

    res.json({ groups });
  })
);

router.get(
  "/users",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const items = await prisma.adminUser.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true, updatedAt: true },
    });
    res.json({ items, total: items.length });
  })
);

router.post(
  "/users",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { email, name, password, role = "editor", active = true } = req.body || {};
    if (!email || !password) throw new HttpError(400, "Email and password required");
    if (!["admin", "editor"].includes(role)) throw new HttpError(400, "Role must be admin or editor");
    const exists = await prisma.adminUser.findUnique({ where: { email: String(email).toLowerCase() } });
    if (exists) throw new HttpError(400, "Email already in use");
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await prisma.adminUser.create({
      data: {
        email: String(email).toLowerCase(),
        name: name || "Editor",
        passwordHash,
        role,
        active: !!active,
      },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    res.status(201).json(user);
  })
);

router.put(
  "/users/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, role, active, password } = req.body || {};
    const data = {};
    if (name !== undefined) data.name = String(name);
    if (role !== undefined) {
      if (!["admin", "editor"].includes(role)) throw new HttpError(400, "Role must be admin or editor");
      data.role = role;
    }
    if (active !== undefined) data.active = !!active;
    if (password) data.passwordHash = await bcrypt.hash(String(password), 10);

    if (req.params.id === req.user.id && data.active === false) {
      throw new HttpError(400, "You cannot deactivate your own account");
    }
    if (req.params.id === req.user.id && data.role && data.role !== "admin") {
      throw new HttpError(400, "You cannot remove your own admin role");
    }

    try {
      const user = await prisma.adminUser.update({
        where: { id: req.params.id },
        data,
        select: { id: true, email: true, name: true, role: true, active: true, createdAt: true, updatedAt: true },
      });
      res.json(user);
    } catch {
      throw new HttpError(404, "User not found");
    }
  })
);

router.delete(
  "/users/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user.id) throw new HttpError(400, "You cannot delete your own account");
    try {
      await prisma.adminUser.delete({ where: { id: req.params.id } });
      res.json({ ok: true });
    } catch {
      throw new HttpError(404, "User not found");
    }
  })
);

router.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "main" } });
    if (!settings) throw new HttpError(404, "Settings not found");
    res.json(settings);
  })
);

router.put(
  "/settings",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = pick(req.body || {}, [
      "name", "short", "tagline", "since", "phone", "phoneAlt", "email",
      "hours", "address", "whatsapp", "socials", "stats",
    ]);
    const settings = await prisma.siteSetting.upsert({
      where: { key: "main" },
      create: { key: "main", ...data },
      update: data,
    });
    res.json(settings);
  })
);

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file?.buffer) throw new HttpError(400, "No file uploaded");

    const kind = String(req.query.kind || req.body?.kind || "cover").toLowerCase();
    const presets = {
      logo: { maxWidth: 256, maxHeight: 256, quality: 70, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } },
      thumb: { maxWidth: 640, maxHeight: 640, quality: 62, fit: "inside" },
      cover: { maxWidth: 960, maxHeight: 960, quality: 64, fit: "inside" },
      hero: { maxWidth: 1200, maxHeight: 1200, quality: 68, fit: "inside" },
    };
    const preset = presets[kind] || presets.cover;
    const maxWidth = Math.min(
      2000,
      Math.max(200, Number(req.query.maxWidth) || Number(req.body?.maxWidth) || preset.maxWidth)
    );
    const quality = Math.min(
      90,
      Math.max(50, Number(req.query.quality) || Number(req.body?.quality) || preset.quality)
    );
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const outPath = path.join(uploadDir, filename);

    let meta;
    try {
      let pipeline = sharp(req.file.buffer).rotate().resize({
        width: maxWidth,
        height: preset.maxHeight || maxWidth,
        fit: preset.fit || "inside",
        withoutEnlargement: true,
        background: preset.background,
      });

      // Strip metadata and convert to efficient WebP for the web
      pipeline = pipeline.webp({
        quality,
        effort: 5,
        smartSubsample: true,
      });

      meta = await pipeline.toFile(outPath);
    } catch {
      throw new HttpError(400, "Could not process image. Try another file.");
    }

    // If replacing an existing upload, delete the old file from disk
    const replaceUrl = String(req.query.replace || req.body?.replace || "").trim();
    if (replaceUrl) {
      try {
        deleteUploadFile(replaceUrl);
      } catch {
        // ignore missing/invalid old files
      }
    }

    res.json({
      url: `/uploads/${filename}`,
      width: meta.width,
      height: meta.height,
      size: meta.size,
      format: "webp",
      kind,
      originalName: req.file.originalname,
      originalSize: req.file.size,
    });
  })
);

router.delete(
  "/upload",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const url = String(req.body?.url || req.query.url || "").trim();
    if (!url) throw new HttpError(400, "Image url required");
    const deleted = deleteUploadFile(url);
    res.json({ ok: true, deleted });
  })
);

function deleteUploadFile(url) {
  const filename = uploadFilenameFromUrl(url);
  if (!filename) return false;
  const full = path.join(uploadDir, filename);
  const resolved = path.resolve(full);
  if (!resolved.startsWith(path.resolve(uploadDir) + path.sep) && resolved !== path.resolve(uploadDir)) {
    throw new HttpError(400, "Invalid upload path");
  }
  if (!fs.existsSync(resolved)) return false;
  fs.unlinkSync(resolved);
  return true;
}

function uploadFilenameFromUrl(url) {
  try {
    const raw = String(url || "").trim();
    if (!raw) return null;
    let pathname = raw;
    if (/^https?:\/\//i.test(raw)) {
      pathname = new URL(raw).pathname;
    }
    const marker = "/uploads/";
    const idx = pathname.indexOf(marker);
    if (idx === -1) return null;
    const name = decodeURIComponent(pathname.slice(idx + marker.length)).replace(/^[/\\]+/, "");
    if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) return null;
    return name;
  } catch {
    return null;
  }
}

function mountCrud(
  basePath,
  model,
  {
    fields,
    search = [],
    orderBy = { updatedAt: "desc" },
    dates = [],
    seo = true,
    published = true,
    sortOrder = true,
    filters = [],
  } = {}
) {
  const allFields = [
    ...fields,
    ...(seo ? SEO_FIELDS : []),
    ...(published ? ["published"] : []),
    ...(sortOrder ? ["sortOrder"] : []),
  ];

  router.get(
    `/${basePath}`,
    asyncHandler(async (req, res) => {
      const { page, pageSize, skip, take } = paginate(req.query);
      const where = {};
      const q = String(req.query.q || "").trim();
      if (q && search.length) {
        where.OR = search.map((field) => ({ [field]: { contains: q, mode: "insensitive" } }));
      }
      for (const field of filters) {
        const value = String(req.query[field] || "").trim();
        if (value) where[field] = value;
      }
      const [items, total] = await Promise.all([
        model.findMany({ where, orderBy, skip, take }),
        model.count({ where }),
      ]);
      res.json({ items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
    })
  );

  router.get(
    `/${basePath}/:id`,
    asyncHandler(async (req, res) => {
      const item = await model.findUnique({ where: { id: req.params.id } });
      if (!item) throw new HttpError(404, "Not found");
      res.json(item);
    })
  );

  router.post(
    `/${basePath}`,
    asyncHandler(async (req, res) => {
      const data = pick(req.body || {}, allFields);
      for (const key of dates) {
        if (data[key]) data[key] = new Date(data[key]);
      }
      const item = await model.create({ data });
      res.status(201).json(item);
    })
  );

  router.put(
    `/${basePath}/:id`,
    asyncHandler(async (req, res) => {
      const data = pick(req.body || {}, allFields);
      for (const key of dates) {
        if (data[key]) data[key] = new Date(data[key]);
      }
      try {
        const item = await model.update({ where: { id: req.params.id }, data });
        res.json(item);
      } catch {
        throw new HttpError(404, "Not found");
      }
    })
  );

  router.delete(
    `/${basePath}/:id`,
    requireAdmin,
    asyncHandler(async (req, res) => {
      try {
        await model.delete({ where: { id: req.params.id } });
        res.json({ ok: true });
      } catch {
        throw new HttpError(404, "Not found");
      }
    })
  );
}

mountCrud("pages", prisma.page, {
  fields: ["slug", "title", "subtitle", "eyebrow", "body", "content"],
  search: ["title", "slug"],
  orderBy: { updatedAt: "desc" },
  sortOrder: false,
});

mountCrud("countries", prisma.country, {
  fields: ["slug", "name", "flag", "code", "region", "blurb", "imageUrl"],
  search: ["name", "slug", "region"],
  orderBy: { sortOrder: "asc" },
});

mountCrud("programs", prisma.program, {
  fields: ["key", "name", "count", "blurb"],
  search: ["name", "key"],
  orderBy: { sortOrder: "asc" },
  seo: false,
  published: false,
});

mountCrud("subjects", prisma.subject, {
  fields: ["name", "popular"],
  search: ["name"],
  orderBy: { sortOrder: "asc" },
  seo: false,
  published: false,
});

mountCrud("universities", prisma.university, {
  fields: [
    "slug", "name", "countrySlug", "city", "feeFrom", "imageUrl", "logoUrl", "programs", "subjects",
    "intakes", "upcoming", "docs", "overview", "studentLife", "accommodation", "campus", "featured",
  ],
  search: ["name", "city", "slug", "countrySlug"],
  orderBy: { sortOrder: "asc" },
  filters: ["countrySlug"],
});

mountCrud("articles", prisma.article, {
  fields: ["slug", "title", "category", "date", "readTime", "author", "image", "excerpt", "content"],
  search: ["title", "slug", "category"],
  orderBy: { date: "desc" },
  dates: ["date"],
  sortOrder: false,
});

mountCrud("events", prisma.event, {
  fields: [
    "slug", "title", "type", "date", "time", "location", "image",
    "excerpt", "description", "agenda",
  ],
  search: ["title", "location", "slug"],
  orderBy: { date: "asc" },
  dates: ["date"],
  sortOrder: false,
});

mountCrud("story-categories", prisma.storyCategory, {
  fields: ["key", "label", "short", "icon", "blurb"],
  search: ["label", "key"],
  orderBy: { sortOrder: "asc" },
  published: false,
});

mountCrud("stories", prisma.story, {
  fields: ["slug", "name", "role", "roleKey", "relation", "image", "youtubeId", "quote", "text"],
  search: ["name", "slug", "quote", "role", "roleKey", "relation"],
  orderBy: { createdAt: "desc" },
  sortOrder: false,
  filters: ["roleKey"],
});

mountCrud("branches", prisma.branch, {
  fields: [
    "slug", "city", "country", "code", "head", "address", "phone", "phoneAlt",
    "email", "hours", "mapQuery", "blurb", "imageUrl", "details",
  ],
  search: ["city", "country", "slug"],
  orderBy: { sortOrder: "asc" },
});

mountCrud("pillars", prisma.pillar, {
  fields: ["slug", "title", "icon", "eyebrow", "teaser", "short", "intro", "points"],
  search: ["title", "slug"],
  orderBy: { sortOrder: "asc" },
});

mountCrud("testimonials", prisma.testimonial, {
  fields: ["initials", "name", "code", "place", "text"],
  search: ["name", "place"],
  orderBy: { sortOrder: "asc" },
  seo: false,
});

mountCrud("services", prisma.service, {
  fields: ["icon", "title", "text"],
  search: ["title"],
  orderBy: { sortOrder: "asc" },
  seo: false,
});

mountCrud("why-us", prisma.whyUs, {
  fields: ["icon", "title", "text"],
  search: ["title"],
  orderBy: { sortOrder: "asc" },
  seo: false,
});

mountCrud("partners", prisma.partner, {
  fields: ["slug"],
  search: ["slug"],
  orderBy: { sortOrder: "asc" },
  seo: false,
});

function leadWhere(query = {}) {
  const where = {};
  if (query.status) where.status = String(query.status);
  if (query.type) where.type = String(query.type);
  const q = String(query.q || "").trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
    ];
  }
  const from = String(query.from || "").trim();
  const to = String(query.to || "").trim();
  if (from || to) {
    where.createdAt = {};
    if (from) {
      const d = new Date(from);
      if (!Number.isNaN(d.getTime())) where.createdAt.gte = d;
    }
    if (to) {
      const d = new Date(to);
      if (!Number.isNaN(d.getTime())) {
        d.setHours(23, 59, 59, 999);
        where.createdAt.lte = d;
      }
    }
  }
  return where;
}

function leadsToCsv(items) {
  const headers = ["Name", "Email", "Phone", "Type", "Status", "Message", "Meta", "Created"];
  const escape = (value) => {
    const s = value == null ? "" : String(value);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const rows = items.map((lead) =>
    [
      lead.name,
      lead.email || "",
      lead.phone || "",
      lead.type,
      lead.status,
      lead.message || "",
      lead.meta ? JSON.stringify(lead.meta) : "",
      lead.createdAt ? new Date(lead.createdAt).toISOString() : "",
    ]
      .map(escape)
      .join(",")
  );
  return `\uFEFF${[headers.join(","), ...rows].join("\n")}`;
}

router.get(
  "/leads",
  asyncHandler(async (req, res) => {
    const { page, pageSize, skip, take } = paginate(req.query);
    const where = leadWhere(req.query);
    const filterBase = leadWhere({ ...req.query, status: undefined });
    const [items, total, statusGroups, typeGroups] = await Promise.all([
      prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.lead.count({ where }),
      prisma.lead.groupBy({ by: ["status"], where: filterBase, _count: { _all: true } }),
      prisma.lead.groupBy({ by: ["type"], where: filterBase, _count: { _all: true } }),
    ]);
    const statusCounts = Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all]));
    const typeCounts = Object.fromEntries(typeGroups.map((g) => [g.type, g._count._all]));
    res.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      statusCounts,
      typeCounts,
    });
  })
);

router.get(
  "/leads/export",
  asyncHandler(async (req, res) => {
    const where = leadWhere(req.query);
    const items = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 5000 });
    const csv = leadsToCsv(items);
    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="leads-${stamp}.csv"`);
    res.send(csv);
  })
);

router.put(
  "/leads/:id",
  asyncHandler(async (req, res) => {
    const data = pick(req.body || {}, ["status", "message", "meta"]);
    try {
      const item = await prisma.lead.update({ where: { id: req.params.id }, data });
      res.json(item);
    } catch {
      throw new HttpError(404, "Lead not found");
    }
  })
);

router.delete(
  "/leads/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      await prisma.lead.delete({ where: { id: req.params.id } });
      res.json({ ok: true });
    } catch {
      throw new HttpError(404, "Lead not found");
    }
  })
);

export default router;
