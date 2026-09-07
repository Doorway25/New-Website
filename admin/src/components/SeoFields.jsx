import ImageUpload from "./ImageUpload";

/**
 * OG = Open Graph — tags Facebook, LinkedIn, WhatsApp, etc. use
 * when someone shares your link (title, description, preview image).
 */
const SEO_GROUPS = [
  {
    key: "search",
    title: "Search engines (Google)",
    blurb: "These control how your page appears in Google search results.",
    fields: [
      {
        key: "metaTitle",
        label: "Meta title",
        help: "The blue clickable title in Google. Keep it clear and under ~60 characters. Include your main keyword + brand if possible.",
        placeholder: "e.g. Study in UK | Education Doorway",
        hint: "Ideal: 50–60 characters",
      },
      {
        key: "metaDescription",
        label: "Meta description",
        type: "textarea",
        help: "The short summary under the title in Google. Write 1–2 sentences that encourage clicks. Under ~155–160 characters.",
        placeholder: "e.g. Free counselling for UK universities, visas and scholarships for Bangladeshi students.",
        hint: "Ideal: 140–160 characters",
        rows: 3,
      },
      {
        key: "metaKeywords",
        label: "Meta keywords",
        help: "Optional comma-separated words related to this page. Google mostly ignores this now, but you can still add a few useful terms.",
        placeholder: "e.g. study in UK, UK student visa, UK universities",
      },
    ],
  },
  {
    key: "social",
    title: "Social sharing — Open Graph (OG)",
    blurb:
      "OG means Open Graph. These fields control the preview card when your link is shared on Facebook, LinkedIn, WhatsApp, Messenger, etc. If left empty, the site can fall back to the search title/description.",
    fields: [
      {
        key: "ogTitle",
        label: "OG title (social title)",
        help: "Title shown on the social preview card. Can match Meta title, or be shorter/more emotional for sharing.",
        placeholder: "e.g. Your path to studying in the UK",
      },
      {
        key: "ogDescription",
        label: "OG description (social description)",
        type: "textarea",
        help: "Short text under the social title when shared. Explain the benefit in 1–2 lines. Not the same as Meta description if you want a more social tone.",
        placeholder: "e.g. Get free expert counselling and apply to top UK universities with Education Doorway.",
        rows: 3,
      },
      {
        key: "ogImage",
        label: "OG image (social preview image)",
        type: "image",
        help: "Image shown in the share preview. Use a wide photo (about 1200×630px). Avoid tiny logos only — show campus, students, or a clear branded visual.",
      },
    ],
  },
  {
    key: "advanced",
    title: "Advanced SEO",
    blurb: "Optional settings for duplicates, indexing, and rich results.",
    fields: [
      {
        key: "canonicalUrl",
        label: "Canonical URL",
        help: "The preferred full URL for this page if the same content can open on more than one link. Example: https://educationdoorway.com/study-in-uk. Leave blank to use the normal page URL.",
        placeholder: "https://educationdoorway.com/...",
      },
      {
        key: "robots",
        label: "Robots",
        help: "Tells search engines what to do. Use index,follow for normal public pages. Use noindex,nofollow if this page should stay out of Google.",
        placeholder: "index,follow",
      },
      {
        key: "schemaJson",
        label: "Schema / structured data",
        type: "textarea",
        rows: 5,
        help: "Extra plain-text notes for rich results (organization, FAQ, course info, etc.). You can write normal sentences — JSON is not required. Leave blank if unsure.",
        placeholder: "e.g. Education Doorway helps students apply to UK universities with free counselling.",
      },
    ],
  },
];

export function SeoFields({ values, onChange }) {
  return (
    <section className="panel seo-panel">
      <div className="panel-head">
        <h2>SEO</h2>
        <p className="muted">
          Fill these so Google and social apps show the right title, summary, and image for this page.
        </p>
      </div>

      <div className="seo-guide">
        <strong>Quick guide</strong>
        <ul>
          <li>
            <b>Meta</b> = Google search listing
          </li>
          <li>
            <b>OG (Open Graph)</b> = Facebook / LinkedIn / WhatsApp share preview
          </li>
          <li>Leave a field empty only if you are happy with the default page title or description</li>
        </ul>
      </div>

      {SEO_GROUPS.map((group) => (
        <div key={group.key} className="seo-group">
          <div className="seo-group-head">
            <h3>{group.title}</h3>
            <p>{group.blurb}</p>
          </div>
          <div className="form-grid">
            {group.fields.map((field) => {
              if (field.type === "image") {
                return (
                  <div key={field.key} className="seo-field span-2">
                    <ImageUpload
                      label={field.label}
                      value={values[field.key] ?? ""}
                      onChange={(url) => onChange(field.key, url)}
                    />
                    {field.help ? <p className="field-help">{field.help}</p> : null}
                  </div>
                );
              }

              const value = values[field.key] ?? "";
              const count = String(value).length;

              return (
                <label key={field.key} className={field.type === "textarea" ? "span-2" : undefined}>
                  <span className="field-label-row">
                    <span>{field.label}</span>
                    {field.hint ? (
                      <span className="field-count">
                        {count} chars · {field.hint}
                      </span>
                    ) : null}
                  </span>
                  {field.help ? <span className="field-help">{field.help}</span> : null}
                  {field.type === "textarea" ? (
                    <textarea
                      rows={field.rows || 3}
                      value={value}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
