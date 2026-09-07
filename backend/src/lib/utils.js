export const SEO_FIELDS = [
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

export function pick(obj, keys) {
  const out = {};
  for (const key of keys) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

export function paginate(query, { maxPageSize = 100 } = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(maxPageSize, Math.max(1, Number(query.pageSize) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
