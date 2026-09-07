import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError } from "../middleware/error.js";
import { paginate } from "../lib/utils.js";

const router = Router();

function cachePublic(res, seconds = 60) {
  res.setHeader("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=${seconds * 5}`);
}

const UNI_LIST_SELECT = {
  id: true,
  slug: true,
  name: true,
  countrySlug: true,
  city: true,
  feeFrom: true,
  imageUrl: true,
  logoUrl: true,
  programs: true,
  subjects: true,
  intakes: true,
  upcoming: true,
  featured: true,
  sortOrder: true,
};

const ARTICLE_LIST_SELECT = {
  id: true,
  slug: true,
  title: true,
  category: true,
  date: true,
  readTime: true,
  author: true,
  image: true,
  excerpt: true,
};

const EVENT_LIST_SELECT = {
  id: true,
  slug: true,
  title: true,
  type: true,
  date: true,
  time: true,
  location: true,
  image: true,
  excerpt: true,
};

const BRANCH_LIST_SELECT = {
  id: true,
  slug: true,
  city: true,
  country: true,
  code: true,
  head: true,
  address: true,
  phone: true,
  phoneAlt: true,
  email: true,
  hours: true,
  mapQuery: true,
  blurb: true,
  imageUrl: true,
  details: true,
  sortOrder: true,
};

router.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "main" } });
    if (!settings) throw new HttpError(404, "Settings not found");
    res.json(settings);
  })
);

router.get(
  "/home",
  asyncHandler(async (_req, res) => {
    const [settings, countries, programs, subjects, testimonials, services, whyUs, partners, pillars, storyCategories] =
      await Promise.all([
        prisma.siteSetting.findUnique({ where: { key: "main" } }),
        prisma.country.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            slug: true,
            name: true,
            flag: true,
            code: true,
            region: true,
            blurb: true,
            imageUrl: true,
            sortOrder: true,
          },
        }),
        prisma.program.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.subject.findMany({
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, popular: true, sortOrder: true },
        }),
        prisma.testimonial.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
        prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
        prisma.whyUs.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
        prisma.partner.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
        prisma.pillar.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
        prisma.storyCategory.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);
    cachePublic(res, 90);
    res.json({
      settings,
      countries,
      programs,
      subjects,
      testimonials,
      services,
      whyUs,
      partners,
      pillars,
      storyCategories,
    });
  })
);

router.get(
  "/pages/:slug",
  asyncHandler(async (req, res) => {
    const page = await prisma.page.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!page) throw new HttpError(404, "Page not found");
    res.json(page);
  })
);

router.get(
  "/countries",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.country.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }));
  })
);

router.get(
  "/universities",
  asyncHandler(async (req, res) => {
    const { page, pageSize, skip, take } = paginate(req.query, { maxPageSize: 500 });
    const where = { published: true };
    if (req.query.country) where.countrySlug = String(req.query.country);
    if (req.query.program) where.programs = { has: String(req.query.program) };
    if (req.query.q) {
      where.OR = [
        { name: { contains: String(req.query.q), mode: "insensitive" } },
        { city: { contains: String(req.query.q), mode: "insensitive" } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.university.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip,
        take,
        select: UNI_LIST_SELECT,
      }),
      prisma.university.count({ where }),
    ]);
    cachePublic(res, 90);
    res.json({ items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  })
);

router.get(
  "/universities/:slug",
  asyncHandler(async (req, res) => {
    const item = await prisma.university.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) throw new HttpError(404, "University not found");
    res.json(item);
  })
);

router.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const { page, pageSize, skip, take } = paginate(req.query, { maxPageSize: 200 });
    const where = { published: true };
    const [items, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take,
        select: ARTICLE_LIST_SELECT,
      }),
      prisma.article.count({ where }),
    ]);
    cachePublic(res, 90);
    res.json({ items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  })
);

router.get(
  "/articles/:slug",
  asyncHandler(async (req, res) => {
    const item = await prisma.article.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) throw new HttpError(404, "Article not found");
    res.json(item);
  })
);

router.get(
  "/events",
  asyncHandler(async (req, res) => {
    const { page, pageSize, skip, take } = paginate(req.query, { maxPageSize: 200 });
    const where = { published: true };
    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: "asc" },
        skip,
        take,
        select: EVENT_LIST_SELECT,
      }),
      prisma.event.count({ where }),
    ]);
    cachePublic(res, 90);
    res.json({ items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  })
);

router.get(
  "/events/:slug",
  asyncHandler(async (req, res) => {
    const item = await prisma.event.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) throw new HttpError(404, "Event not found");
    res.json(item);
  })
);

router.get(
  "/stories",
  asyncHandler(async (req, res) => {
    const { page, pageSize, skip, take } = paginate(req.query);
    const where = { published: true };
    if (req.query.roleKey) where.roleKey = String(req.query.roleKey);
    const [items, total] = await Promise.all([
      prisma.story.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.story.count({ where }),
    ]);
    res.json({ items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  })
);

router.get(
  "/stories/:slug",
  asyncHandler(async (req, res) => {
    const item = await prisma.story.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) throw new HttpError(404, "Story not found");
    res.json(item);
  })
);

router.get(
  "/branches",
  asyncHandler(async (_req, res) => {
    cachePublic(res, 120);
    res.json(
      await prisma.branch.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        select: BRANCH_LIST_SELECT,
      })
    );
  })
);

router.get(
  "/branches/:slug",
  asyncHandler(async (req, res) => {
    const item = await prisma.branch.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) throw new HttpError(404, "Branch not found");
    res.json(item);
  })
);

router.get(
  "/pillars",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.pillar.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }));
  })
);

router.get(
  "/pillars/:slug",
  asyncHandler(async (req, res) => {
    const item = await prisma.pillar.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) throw new HttpError(404, "Pillar not found");
    res.json(item);
  })
);

router.post(
  "/leads",
  asyncHandler(async (req, res) => {
    const { type = "counselling", name, email, phone, message, meta } = req.body || {};
    if (!name) throw new HttpError(400, "Name is required");
    if (!email && !phone) throw new HttpError(400, "Email or phone is required");
    const lead = await prisma.lead.create({
      data: {
        type: String(type),
        name: String(name),
        email: email ? String(email) : null,
        phone: phone ? String(phone) : null,
        message: message ? String(message) : null,
        meta: meta || undefined,
      },
    });
    res.status(201).json({ ok: true, id: lead.id });
  })
);

export default router;
