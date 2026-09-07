/** CMS resource configs — aligned with backend mountCrud routes */

export const SEO_KEYS = [
  "metaTitle",
  "metaDescription",
  "metaKeywords",
  "ogTitle",
  "ogDescription",
  "ogImage",
  "canonicalUrl",
  "robots",
  "schemaJson",
];

/** ISO flag codes used on the public site (Flag component) */
export const FLAG_COUNTRIES = [
  { value: "gb", label: "United Kingdom" },
  { value: "bd", label: "Bangladesh" },
  { value: "pk", label: "Pakistan" },
  { value: "ng", label: "Nigeria" },
  { value: "my", label: "Malaysia" },
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "ie", label: "Ireland" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "es", label: "Spain" },
  { value: "nl", label: "Netherlands" },
];

/** Country slugs used by universities / public Study tabs */
export const UNIVERSITY_COUNTRY_OPTIONS = [
  { value: "uk", label: "UK" },
  { value: "malaysia", label: "Malaysia" },
  { value: "australia", label: "Australia" },
  { value: "canada", label: "Canada" },
  { value: "usa", label: "USA" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "ireland", label: "Ireland" },
  { value: "uae", label: "UAE" },
  { value: "ksa", label: "KSA" },
];

export function flagImageUrl(code, width = 80) {
  const c = String(code || "").trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(c)) return "";
  return `https://flagcdn.com/w${width}/${c}.png`;
}

export const resources = {
  pages: {
    path: "pages",
    label: "Pages",
    singular: "Page",
    titleKey: "title",
    subtitleKey: "slug",
    group: "content",
    seo: true,
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title", label: "Title", required: true },
      { key: "subtitle", label: "Subtitle" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "body", label: "Body", type: "richtext" },
      { key: "content", label: "Content", type: "richtext" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  countries: {
    path: "countries",
    label: "Countries",
    singular: "Country",
    titleKey: "name",
    subtitleKey: "region",
    group: "study",
    seo: true,
    fields: [
      { key: "slug", label: "Slug", required: true, section: "Basics", hint: "URL key, e.g. uk" },
      { key: "name", label: "Name", required: true, section: "Basics" },
      { key: "flag", label: "Flag emoji", section: "Basics" },
      { key: "code", label: "Flag code (e.g. gb)", required: true, section: "Basics" },
      { key: "region", label: "Region", required: true, section: "Basics", hint: "Shown on country cards" },
      { key: "blurb", label: "Card blurb", type: "textarea", rows: 3, section: "Page content", hint: "Countries page card text" },
      { key: "imageUrl", label: "Hero / card image", type: "image", section: "Page content" },
      { key: "sortOrder", label: "Sort order", type: "number", section: "Publishing" },
      { key: "published", label: "Published", type: "checkbox", section: "Publishing" },
    ],
  },
  programs: {
    path: "programs",
    label: "Programs",
    singular: "Program",
    titleKey: "name",
    subtitleKey: "key",
    group: "study",
    seo: false,
    fields: [
      { key: "key", label: "Key", required: true },
      { key: "name", label: "Name", required: true },
      { key: "count", label: "Course count label" },
      { key: "blurb", label: "Blurb", type: "textarea", rows: 3 },
      { key: "sortOrder", label: "Sort order", type: "number" },
    ],
  },
  subjects: {
    path: "subjects",
    label: "Subjects / Courses",
    singular: "Subject",
    titleKey: "name",
    subtitleKey: "popular",
    group: "study",
    seo: false,
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "popular", label: "Popular", type: "checkbox" },
      { key: "sortOrder", label: "Sort order", type: "number" },
    ],
  },
  universities: {
    path: "universities",
    label: "Universities",
    singular: "University",
    titleKey: "name",
    subtitleKey: "city",
    group: "study",
    seo: true,
    pageSize: 20,
    filterTabs: {
      param: "countrySlug",
      options: [
        { value: "", label: "All" },
        ...UNIVERSITY_COUNTRY_OPTIONS,
      ],
    },
    fields: [
      { key: "slug", label: "Slug", required: true, section: "Basics" },
      { key: "name", label: "Name", required: true, section: "Basics" },
      {
        key: "countrySlug",
        label: "Country",
        required: true,
        type: "select",
        section: "Basics",
        options: UNIVERSITY_COUNTRY_OPTIONS,
        hint: "Must match a published country slug",
      },
      { key: "city", label: "City", required: true, section: "Basics" },
      { key: "feeFrom", label: "Tuition from (USD)", type: "number", required: true, section: "Basics" },
      { key: "imageUrl", label: "Cover image", type: "image", section: "Media", kind: "cover", hint: "Campus / card photo — auto WebP resize on upload" },
      { key: "logoUrl", label: "Logo", type: "image", section: "Media", kind: "logo", hint: "Square or transparent logo — optimized to ~512px WebP" },
      { key: "programs", label: "Study levels / programmes", type: "stringlist", section: "Programmes", hint: "One per line: foundation, undergraduate, postgraduate…" },
      { key: "subjects", label: "Courses / subject areas", type: "stringlist", section: "Programmes", hint: "Shown under Courses / Categories" },
      { key: "intakes", label: "Intakes", type: "stringlist", section: "Intakes", hint: "e.g. Jan, May, Sep" },
      { key: "upcoming", label: "Upcoming intakes", type: "stringlist", section: "Intakes", hint: "Highlighted on university page" },
      { key: "docs", label: "Required documents", type: "stringlist", section: "Intakes", hint: "One document per line" },
      { key: "overview", label: "Overview", type: "textarea", rows: 6, section: "Campus life", hint: "University page Overview tab" },
      { key: "studentLife", label: "Student life", type: "stringlist", section: "Campus life", hint: "Bullet points for Student Life tab" },
      { key: "accommodation", label: "Accommodation", type: "stringlist", section: "Campus life", hint: "Bullet points for Accommodation tab" },
      { key: "campus", label: "Campus", type: "stringlist", section: "Campus life", hint: "Bullet points for Campus tab" },
      { key: "featured", label: "Featured", type: "checkbox", section: "Publishing" },
      { key: "sortOrder", label: "Sort order", type: "number", section: "Publishing" },
      { key: "published", label: "Published", type: "checkbox", section: "Publishing" },
    ],
  },
  articles: {
    path: "articles",
    label: "Articles",
    singular: "Article",
    titleKey: "title",
    subtitleKey: "category",
    group: "content",
    seo: true,
    fields: [
      { key: "slug", label: "Slug", required: true, section: "Basics" },
      { key: "title", label: "Title", required: true, section: "Basics" },
      { key: "category", label: "Category", required: true, section: "Basics", hint: "Filter chip on Articles page" },
      { key: "date", label: "Publish date", type: "datetime", required: true, section: "Basics" },
      { key: "readTime", label: "Read time (min)", type: "number", required: true, section: "Basics" },
      { key: "author", label: "Author", required: true, section: "Basics" },
      { key: "image", label: "Cover image", type: "image", section: "Media" },
      { key: "excerpt", label: "Excerpt", type: "textarea", rows: 3, section: "Content", hint: "Lead paragraph under the title" },
      { key: "content", label: "Article body", type: "richtext", asArray: true, section: "Content" },
      { key: "published", label: "Published", type: "checkbox", section: "Publishing" },
    ],
  },
  events: {
    path: "events",
    label: "Events",
    singular: "Event",
    titleKey: "title",
    subtitleKey: "location",
    group: "content",
    seo: false,
    fields: [
      { key: "slug", label: "Slug", required: true, section: "Basics" },
      { key: "title", label: "Title", required: true, section: "Basics" },
      { key: "type", label: "Type", required: true, section: "Basics", hint: "In-person or Online" },
      { key: "date", label: "Date", type: "datetime", required: true, section: "Basics" },
      { key: "time", label: "Time", required: true, section: "Basics" },
      { key: "location", label: "Location", required: true, section: "Basics" },
      { key: "image", label: "Cover image", type: "image", section: "Media" },
      { key: "excerpt", label: "Short excerpt", type: "textarea", rows: 3, section: "Content", hint: "Card / preview text" },
      { key: "description", label: "About this event", type: "textarea", rows: 6, section: "Content", hint: "Blank line between paragraphs" },
      { key: "agenda", label: "What to expect", type: "paragraphs", section: "Agenda", hint: "One agenda item per line" },
      { key: "published", label: "Published", type: "checkbox", section: "Publishing" },
    ],
  },
  stories: {
    path: "stories",
    label: "Stories",
    singular: "Story",
    titleKey: "name",
    subtitleKey: "role",
    group: "content",
    seo: false,
    pageSize: 10,
    filterTabs: {
      param: "roleKey",
      options: [
        { value: "", label: "All" },
        { value: "delegate", label: "Delegate" },
        { value: "student", label: "Student" },
        { value: "guardian", label: "Guardian" },
      ],
    },
    fields: [
      { key: "slug", label: "Slug", required: true, section: "Basics" },
      { key: "name", label: "Name", required: true, section: "Basics" },
      { key: "roleKey", label: "Category", required: true, type: "select", section: "Basics", options: [
        { value: "delegate", label: "Delegate" },
        { value: "student", label: "Student" },
        { value: "guardian", label: "Guardian" },
      ] },
      { key: "role", label: "Role label", required: true, section: "Basics", hint: "Shown on the card (usually matches category)" },
      { key: "relation", label: "Relation", section: "Basics" },
      { key: "published", label: "Published", type: "checkbox", section: "Basics" },
      { key: "image", label: "Image / thumbnail", type: "image", section: "Media", span: "full", hint: "Upload manually, or it auto-fills from the YouTube video below." },
      {
        key: "youtubeId",
        label: "YouTube video",
        section: "Media",
        span: "full",
        hint: "Paste the link, then click Fetch title & description. Quote + body text fill automatically (you can edit after).",
      },
      { key: "quote", label: "Title / quote", type: "textarea", rows: 3, section: "Content", span: "full" },
      { key: "text", label: "Description", type: "paragraphs", section: "Content", span: "full", hint: "One paragraph per line" },
    ],
  },
  branches: {
    path: "branches",
    label: "Branches",
    singular: "Branch",
    titleKey: "city",
    subtitleKey: "country",
    group: "site",
    seo: true,
    fields: [
      { key: "slug", label: "Slug", required: true, section: "Basics" },
      { key: "city", label: "City", required: true, section: "Basics" },
      { key: "country", label: "Country", required: true, section: "Basics" },
      { key: "code", label: "Flag code", required: true, section: "Basics", hint: "e.g. gb, bd" },
      { key: "head", label: "Head office", type: "checkbox", section: "Basics" },
      { key: "address", label: "Address", type: "textarea", rows: 2, required: true, section: "Contact" },
      { key: "phone", label: "Phone", required: true, section: "Contact" },
      { key: "phoneAlt", label: "Phone alt", section: "Contact" },
      { key: "email", label: "Email", required: true, section: "Contact" },
      { key: "hours", label: "Office hours", required: true, section: "Contact" },
      { key: "mapQuery", label: "Google Maps query", section: "Location", hint: "Used for the embedded map" },
      { key: "blurb", label: "Page blurb", type: "textarea", rows: 3, section: "Page content", hint: "Hero subtitle & intro" },
      { key: "imageUrl", label: "Branch image", type: "image", section: "Page content" },
      { key: "details", label: "What this branch offers", type: "stringlist", section: "Page content", hint: "One service per line" },
      { key: "sortOrder", label: "Sort order", type: "number", section: "Publishing" },
      { key: "published", label: "Published", type: "checkbox", section: "Publishing" },
    ],
  },
  testimonials: {
    path: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    titleKey: "name",
    subtitleKey: "place",
    group: "site",
    seo: false,
    fields: [
      { key: "initials", label: "Initials", required: true, section: "Basics" },
      { key: "name", label: "Name", required: true, section: "Basics" },
      {
        key: "code",
        label: "Country",
        type: "country",
        required: true,
        section: "Basics",
        options: FLAG_COUNTRIES,
      },
      { key: "place", label: "Place", required: true, section: "Basics", hint: "e.g. University of Manchester, UK" },
      { key: "text", label: "Text", type: "textarea", rows: 4, required: true, section: "Content", span: "full" },
      { key: "sortOrder", label: "Sort order", type: "number", section: "Publishing" },
      { key: "published", label: "Published", type: "checkbox", section: "Publishing" },
    ],
  },
  services: {
    path: "services",
    label: "Services",
    singular: "Service",
    titleKey: "title",
    subtitleKey: "icon",
    group: "site",
    seo: false,
    fields: [
      { key: "icon", label: "Icon" },
      { key: "title", label: "Title", required: true },
      { key: "text", label: "Text", type: "textarea", rows: 3, required: true },
      { key: "sortOrder", label: "Sort order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  "why-us": {
    path: "why-us",
    label: "Why us",
    singular: "Why-us item",
    titleKey: "title",
    subtitleKey: "icon",
    group: "site",
    seo: false,
    fields: [
      { key: "icon", label: "Icon" },
      { key: "title", label: "Title", required: true },
      { key: "text", label: "Text", type: "textarea", rows: 3, required: true },
      { key: "sortOrder", label: "Sort order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  partners: {
    path: "partners",
    label: "Partners",
    singular: "Partner",
    titleKey: "slug",
    subtitleKey: "countrySlug",
    group: "site",
    seo: false,
    pageSize: 50,
    partnerMode: true,
    countriesOnly: ["uk", "malaysia"],
    help: "Affiliated Universities marquee on the homepage. Only UK and Malaysia universities can be featured. Order controls left-to-right position.",
    filterTabs: {
      param: "country",
      options: [
        { value: "", label: "All" },
        { value: "uk", label: "UK" },
        { value: "malaysia", label: "Malaysia" },
      ],
    },
    fields: [
      {
        key: "slug",
        label: "University",
        type: "university-slug",
        required: true,
        section: "Basics",
        countriesOnly: ["uk", "malaysia"],
        hint: "UK and Malaysia universities only. Create the university under Universities first if it is missing.",
      },
      { key: "sortOrder", label: "Sort order", type: "number", section: "Basics", hint: "Lower numbers appear first in the homepage marquee." },
      { key: "published", label: "Published", type: "checkbox", section: "Basics" },
    ],
  },
};

export const NAV_GROUPS = [
  {
    key: "main",
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", end: true, icon: "grid" },
      { to: "/leads", label: "Leads", icon: "inbox" },
    ],
  },
  {
    key: "study",
    label: "Study",
    items: [
      { to: "/countries", label: "Countries", icon: "globe" },
      { to: "/universities", label: "Universities", icon: "building" },
      { to: "/programs", label: "Programs", icon: "layers" },
      { to: "/subjects", label: "Courses / Subjects", icon: "book" },
    ],
  },
  {
    key: "content",
    label: "Content",
    items: [
      { to: "/pages", label: "Pages", icon: "file" },
      { to: "/articles", label: "Articles", icon: "article" },
      { to: "/events", label: "Events", icon: "calendar" },
      { to: "/stories", label: "Stories", icon: "star" },
    ],
  },
  {
    key: "site",
    label: "Site",
    items: [
      { to: "/branches", label: "Branches", icon: "pin" },
      { to: "/testimonials", label: "Testimonials", icon: "quote" },
      { to: "/services", label: "Services", icon: "spark" },
      { to: "/why-us", label: "Why us", icon: "check" },
      { to: "/partners", label: "Affiliated Universities", icon: "users" },
      { to: "/settings", label: "Settings", icon: "settings" },
    ],
  },
  {
    key: "account",
    label: "Account",
    items: [
      { to: "/profile", label: "Profile", icon: "user" },
      { to: "/users", label: "Users", adminOnly: true, icon: "shield" },
    ],
  },
];

export function emptyValues(resource) {
  const values = {};
  for (const field of resource.fields) {
    if (field.type === "checkbox") values[field.key] = field.key === "published" || field.key === "popular";
    else if (field.type === "number") values[field.key] = field.key === "sortOrder" ? 0 : "";
    else if (field.type === "stringlist" || field.type === "paragraphs" || field.type === "pointlist" || field.type === "richtext") values[field.key] = "";
    else if (field.type === "json") values[field.key] = "";
    else values[field.key] = "";
  }
  if (resource.seo) {
    for (const key of SEO_KEYS) {
      values[key] = key === "robots" ? "index,follow" : "";
    }
  }
  return values;
}

/** Whether list view should show Published/Draft column */
export function hasPublished(resource) {
  return resource.fields.some((f) => f.key === "published");
}

function pointsToText(raw) {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (!Array.isArray(raw)) return "";
  return raw
    .map((p) => {
      if (typeof p === "string") return p;
      const icon = p.icon || "spark";
      const title = p.title || "";
      const text = p.text || "";
      return `${icon} | ${title} | ${text}`;
    })
    .join("\n");
}

function textToPoints(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((s) => s.trim());
      if (parts.length >= 3) {
        return { icon: parts[0] || "spark", title: parts[1], text: parts.slice(2).join(" | ") };
      }
      if (parts.length === 2) {
        return { icon: "spark", title: parts[0], text: parts[1] };
      }
      return { icon: "spark", title: parts[0], text: "" };
    });
}

function contentToHtml(raw) {
  if (raw == null || raw === "") return "";
  if (typeof raw === "string") {
    // Already HTML
    if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
    // Plain text → paragraphs
    return raw
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `<p>${escapeHtml(s)}</p>`)
      .join("");
  }
  if (Array.isArray(raw)) {
    return raw
      .map((s) => String(s || "").trim())
      .filter(Boolean)
      .map((s) => ( /<[a-z][\s\S]*>/i.test(s) ? s : `<p>${escapeHtml(s)}</p>`))
      .join("");
  }
  if (raw.sections && Array.isArray(raw.sections)) {
    return raw.sections
      .map((s) => {
        const heading = s.heading ? `<h2>${escapeHtml(s.heading)}</h2>` : "";
        const paras = (s.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("");
        const bullets = (s.bullets || []).length
          ? `<ul>${(s.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
          : "";
        return `${heading}${paras}${bullets}`;
      })
      .join("");
  }
  if (raw.html) return String(raw.html);
  if (raw.notes) return contentToHtml(raw.notes);
  return "";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function contentToText(raw) {
  if (raw == null || raw === "") return "";
  if (typeof raw === "string") return raw.replace(/<[^>]+>/g, "").trim() ? raw : "";
  if (Array.isArray(raw)) return raw.join("\n");
  if (raw.sections && Array.isArray(raw.sections)) {
    return raw.sections
      .map((s) => {
        const paras = (s.paragraphs || []).join("\n");
        const bullets = (s.bullets || []).map((b) => `• ${b}`).join("\n");
        return [s.heading, paras, bullets].filter(Boolean).join("\n");
      })
      .join("\n\n");
  }
  if (raw.notes) return String(raw.notes);
  try {
    return Object.values(raw)
      .flat()
      .filter((v) => typeof v === "string")
      .join("\n");
  } catch {
    return "";
  }
}

export function itemToForm(resource, item) {
  const values = emptyValues(resource);
  for (const field of resource.fields) {
    const raw = item[field.key];
    if (raw === undefined || raw === null) continue;
    if (field.type === "stringlist") {
      values[field.key] = Array.isArray(raw) ? raw.join("\n") : String(raw);
    } else if (field.type === "paragraphs") {
      values[field.key] = field.key === "content" ? contentToText(raw) : Array.isArray(raw) ? raw.join("\n") : String(raw);
    } else if (field.type === "richtext") {
      values[field.key] = contentToHtml(raw);
    } else if (field.type === "pointlist") {
      values[field.key] = pointsToText(raw);
    } else if (field.type === "json") {
      values[field.key] = typeof raw === "string" ? raw : contentToText(raw) || "";
    } else if (field.type === "datetime") {
      values[field.key] = toDatetimeLocal(raw);
    } else if (field.type === "checkbox") {
      values[field.key] = !!raw;
    } else {
      values[field.key] = raw;
    }
  }
  if (resource.seo) {
    for (const key of SEO_KEYS) {
      if (key === "schemaJson") {
        const raw = item[key];
        values[key] = schemaToPlainText(raw);
      } else {
        values[key] = item[key] ?? (key === "robots" ? "index,follow" : "");
      }
    }
  }
  return values;
}

export function formToPayload(resource, values) {
  const payload = {};
  for (const field of resource.fields) {
    const raw = values[field.key];
    if (field.type === "stringlist") {
      payload[field.key] = String(raw || "")
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (field.type === "paragraphs") {
      const lines = String(raw || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      payload[field.key] = lines;
    } else if (field.type === "richtext") {
      const html = String(raw || "").trim();
      if (field.asArray) {
        payload[field.key] = html ? [html] : [];
      } else {
        payload[field.key] = html || null;
      }
    } else if (field.type === "pointlist") {
      payload[field.key] = textToPoints(raw);
    } else if (field.type === "json") {
      const text = String(raw || "").trim();
      payload[field.key] = text || null;
    } else if (field.type === "number") {
      payload[field.key] = raw === "" || raw === null ? 0 : Number(raw);
    } else if (field.type === "checkbox") {
      payload[field.key] = !!raw;
    } else if (field.type === "datetime") {
      payload[field.key] = raw || null;
    } else if (field.key === "youtubeId") {
      payload[field.key] = extractYoutubeId(raw);
    } else {
      payload[field.key] = raw === "" ? null : raw;
    }
  }
  if (resource.seo) {
    for (const key of SEO_KEYS) {
      if (key === "schemaJson") {
        const text = String(values[key] || "").trim();
        payload[key] = text || null;
      } else {
        payload[key] = values[key] || null;
      }
    }
  }
  return payload;
}

export function extractYoutubeId(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{6,20}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const embed = url.pathname.match(/\/embed\/([^/?]+)/);
    if (embed?.[1]) return embed[1];
    const shorts = url.pathname.match(/\/shorts\/([^/?]+)/);
    if (shorts?.[1]) return shorts[1];
  } catch {
    // not a URL
  }
  return raw;
}

export function youtubeThumbUrl(idOrUrl) {
  const id = extractYoutubeId(idOrUrl);
  if (!id) return "";
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function isYoutubeThumbUrl(url) {
  return typeof url === "string" && /ytimg\.com\/vi\//i.test(url);
}

function schemaToPlainText(raw) {
  if (raw == null || raw === "") return "";
  if (typeof raw === "string") return raw;
  try {
    return JSON.stringify(raw, null, 2);
  } catch {
    return String(raw);
  }
}

function toDatetimeLocal(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
