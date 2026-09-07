import { Helmet } from "react-helmet-async";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://educationdoorway.com").replace(/\/$/, "");
const SITE_NAME = "Education Doorway";

function absUrl(url) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function SeoHead({
  seo,
  title,
  description,
  image,
  path = "/",
  type = "website",
}) {
  const meta = seo || {};
  const pageTitle = meta.metaTitle || title || SITE_NAME;
  const pageDescription = meta.metaDescription || description || "";
  const keywords = meta.metaKeywords || "";
  const ogTitle = meta.ogTitle || pageTitle;
  const ogDescription = meta.ogDescription || pageDescription;
  const ogImage = absUrl(meta.ogImage || image);
  const canonical = meta.canonicalUrl || absUrl(path);
  const robots = meta.robots || "index,follow";
  const schema = normalizeSchema(meta.schemaJson);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {pageDescription ? <meta name="description" content={pageDescription} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitle} />
      {ogDescription ? <meta property="og:description" content={ogDescription} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}

      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={ogTitle} />
      {ogDescription ? <meta name="twitter:description" content={ogDescription} /> : null}
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {schema ? <script type="application/ld+json">{schema}</script> : null}
    </Helmet>
  );
}

function normalizeSchema(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return null;
    // Allow plain text; if it already looks like JSON, keep as-is
    try {
      JSON.parse(text);
      return text;
    } catch {
      // Plain text → wrap as a simple Thing description
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        description: text,
      });
    }
  }
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}
