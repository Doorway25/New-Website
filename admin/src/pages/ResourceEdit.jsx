import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API_URL, get, post, put } from "../api";
import ImageUpload from "../components/ImageUpload";
import RichTextEditor from "../components/RichTextEditor";
import { SeoFields } from "../components/SeoFields";
import {
  emptyValues,
  extractYoutubeId,
  flagImageUrl,
  formToPayload,
  isYoutubeThumbUrl,
  itemToForm,
  resources,
  youtubeThumbUrl,
} from "../resources";

function adminMediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("blob:")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function groupFields(fields) {
  const sections = [];
  const map = new Map();
  for (const field of fields) {
    const name = field.section || "Details";
    if (!map.has(name)) {
      const group = { name, fields: [] };
      map.set(name, group);
      sections.push(group);
    }
    map.get(name).fields.push(field);
  }
  return sections;
}

export default function ResourceEdit({ resourceKey }) {
  const resource = resources[resourceKey];
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState(() => emptyValues(resource));
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [fetchingYoutube, setFetchingYoutube] = useState(false);
  const [universityOptions, setUniversityOptions] = useState([]);

  const sections = useMemo(() => groupFields(resource.fields), [resource]);
  const hasYoutube = resource.fields.some((f) => f.key === "youtubeId");
  const needsUniversities = resource.fields.some((f) => f.type === "university-slug");

  useEffect(() => {
    if (!needsUniversities) return;
    const countriesOnlyField = resource.fields.find((f) => f.type === "university-slug");
    const countries = countriesOnlyField?.countriesOnly || resource.countriesOnly || null;

    const loadUnis = async () => {
      try {
        let items = [];
        if (countries?.length) {
          const lists = await Promise.all(
            countries.map((countrySlug) =>
              get(`/api/admin/universities?pageSize=200&countrySlug=${encodeURIComponent(countrySlug)}`).then(
                (res) => res?.items || []
              )
            )
          );
          items = lists.flat();
        } else {
          const res = await get("/api/admin/universities?pageSize=200");
          items = res?.items || [];
        }
        setUniversityOptions(
          items
            .map((u) => ({
              value: u.slug,
              label: u.name
                ? `${u.name} · ${(u.countrySlug || "").toUpperCase()}`
                : u.slug,
              logoUrl: u.logoUrl || "",
              countrySlug: u.countrySlug || "",
              name: u.name || u.slug,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      } catch {
        setUniversityOptions([]);
      }
    };
    loadUnis();
  }, [needsUniversities, resourceKey, resource.fields, resource.countriesOnly]);

  useEffect(() => {
    if (isNew) {
      const next = emptyValues(resource);
      const roleKey = searchParams.get("roleKey");
      if (roleKey && Object.prototype.hasOwnProperty.call(next, "roleKey")) {
        next.roleKey = roleKey;
        if (Object.prototype.hasOwnProperty.call(next, "role") && !next.role) {
          next.role = roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
        }
      }
      const countrySlug = searchParams.get("countrySlug");
      if (countrySlug && Object.prototype.hasOwnProperty.call(next, "countrySlug")) {
        next.countrySlug = countrySlug;
      }
      setValues(next);
      setLoading(false);
      return;
    }
    setLoading(true);
    get(`/api/admin/${resource.path}/${id}`)
      .then((item) => setValues(itemToForm(resource, item)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [resourceKey, id, isNew, resource, searchParams]);

  function setField(key, value) {
    if (key === "youtubeId" && hasYoutube) {
      setValues((prev) => applyYoutubeChange(prev, value));
      return;
    }
    if (key === "roleKey" && resourceKey === "stories") {
      const label = value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
      setValues((prev) => {
        const prevKey = String(prev.roleKey || "").toLowerCase();
        const prevRole = String(prev.role || "");
        const synced = !prevRole || prevRole.toLowerCase() === prevKey;
        return {
          ...prev,
          roleKey: value,
          role: synced ? label : prev.role,
        };
      });
      return;
    }
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function useYoutubeThumb() {
    const thumb = youtubeThumbUrl(values.youtubeId);
    if (!thumb) return;
    setField("image", thumb);
  }

  async function fetchYoutubeDetails(rawValue = values.youtubeId) {
    const id = extractYoutubeId(rawValue);
    if (!id) {
      setError("Enter a valid YouTube URL or ID first");
      return;
    }
    setError("");
    setMessage("");
    setFetchingYoutube(true);
    try {
      const meta = await get(`/api/admin/youtube-meta?id=${encodeURIComponent(id)}`);
      setValues((prev) => {
        const next = applyYoutubeChange(prev, meta.id);
        const imageIsAuto =
          !prev.image || isYoutubeThumbUrl(prev.image) || prev.image === youtubeThumbUrl(prev.youtubeId);
        return {
          ...next,
          youtubeId: meta.id,
          // Always use YouTube original title + description when Fetch is clicked
          quote: meta.quote || meta.title || prev.quote || "",
          text: meta.text || prev.text || "",
          image: imageIsAuto && meta.thumbnail ? meta.thumbnail : next.image || meta.thumbnail || "",
        };
      });
      setMessage("YouTube original title & description loaded — review and save");
    } catch (err) {
      setError(err.message || "Could not fetch YouTube details");
    } finally {
      setFetchingYoutube(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const payload = formToPayload(resource, values);
      if (isNew) {
        const created = await post(`/api/admin/${resource.path}`, payload);
        setMessage("Created");
        navigate(`/${resource.path}/${created.id}`, { replace: true });
      } else {
        await put(`/api/admin/${resource.path}/${id}`, payload);
        setMessage("Saved");
      }
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header row">
        <div>
          <p className="crumb">
            <Link to={`/${resource.path}`}>{resource.label}</Link>
          </p>
          <h1>
            {isNew ? `New ${resource.singular.toLowerCase()}` : `Edit ${resource.singular.toLowerCase()}`}
          </h1>
          <p className="muted">{resource.help || "Fields match what visitors see on the public website."}</p>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert ok">{message}</div>}

      <form className="edit-form" onSubmit={onSubmit}>
        {sections.map((section) => (
          <section key={section.name} className="panel">
            <div className="panel-head">
              <h2>{section.name}</h2>
            </div>
            <div className="form-grid">
              {section.fields.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  values={values}
                  onChange={setField}
                  universityOptions={universityOptions}
                  onUseYoutubeThumb={field.key === "youtubeId" ? useYoutubeThumb : undefined}
                  onFetchYoutube={field.key === "youtubeId" ? fetchYoutubeDetails : undefined}
                  fetchingYoutube={fetchingYoutube}
                />
              ))}
            </div>
          </section>
        ))}

        {resource.seo && <SeoFields values={values} onChange={setField} />}

        <div className="form-actions sticky-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
          </button>
          <Link className="btn ghost" to={`/${resource.path}`}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function applyYoutubeChange(prev, rawValue) {
  const nextId = extractYoutubeId(rawValue);
  const nextThumb = nextId ? youtubeThumbUrl(nextId) : "";
  const prevThumb = prev.youtubeId ? youtubeThumbUrl(prev.youtubeId) : "";
  const imageIsAuto = !prev.image || isYoutubeThumbUrl(prev.image) || prev.image === prevThumb;

  return {
    ...prev,
    youtubeId: rawValue,
    image: nextId
      ? imageIsAuto
        ? nextThumb
        : prev.image
      : imageIsAuto
        ? ""
        : prev.image,
  };
}

function fieldClassName(field, extra = "") {
  const full =
    field.span === "full" ||
    field.type === "image" ||
    field.type === "richtext" ||
    field.type === "textarea" ||
    field.type === "paragraphs" ||
    field.type === "pointlist" ||
    field.type === "json" ||
    field.type === "stringlist" ||
    field.key === "youtubeId";
  return ["field-block", full ? "span-full" : "", extra].filter(Boolean).join(" ");
}

function Field({ field, value, values, onChange, universityOptions = [], onUseYoutubeThumb, onFetchYoutube, fetchingYoutube }) {
  const common = {
    id: field.key,
    required: !!field.required,
  };

  const hint = field.hint ? <small className="field-hint">{field.hint}</small> : null;

  if (field.type === "image") {
    return (
      <div className={fieldClassName(field)}>
        <ImageUpload
          label={field.label}
          value={value ?? ""}
          required={!!field.required}
          kind={field.kind || "cover"}
          hint={field.hint || undefined}
          onChange={(url) => onChange(field.key, url)}
        />
        {hint}
        {values?.youtubeId && youtubeThumbUrl(values.youtubeId) ? (
          <button type="button" className="btn ghost thumb-btn" onClick={() => onChange(field.key, youtubeThumbUrl(values.youtubeId))}>
            Use YouTube thumbnail
          </button>
        ) : null}
      </div>
    );
  }

  if (field.type === "richtext") {
    return (
      <div className={fieldClassName(field)}>
        <RichTextEditor
          label={field.label}
          value={value ?? ""}
          required={!!field.required}
          onChange={(html) => onChange(field.key, html)}
        />
        {hint}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className={`${fieldClassName(field)} check-field`}>
        <span className="field-label">{field.label}</span>
        <span className="check">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(field.key, e.target.checked)}
          />
          <span>{value ? "Yes — visible on site" : "No — draft / hidden"}</span>
        </span>
        {hint}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className={fieldClassName(field)}>
        <span className="field-label">{field.label}</span>
        <select
          {...common}
          value={value ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">Select…</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint}
      </label>
    );
  }

  if (field.type === "university-slug") {
    const options = universityOptions.length
      ? universityOptions
      : value
        ? [{ value, label: value, logoUrl: "", name: value }]
        : [];
    const selected = options.find((o) => o.value === value);
    return (
      <div className={fieldClassName(field, "span-full")}>
        <label className="field-block">
          <span className="field-label">{field.label}</span>
          <select
            {...common}
            value={value ?? ""}
            onChange={(e) => onChange(field.key, e.target.value)}
          >
            <option value="">Select university…</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hint}
        </label>
        {selected ? (
          <div className="partner-uni-preview">
            <div className="partner-list-logo lg">
              {selected.logoUrl ? (
                <img src={adminMediaUrl(selected.logoUrl)} alt="" />
              ) : (
                <span>{String(selected.name || "?").slice(0, 1)}</span>
              )}
            </div>
            <div>
              <strong>{selected.name || selected.value}</strong>
              <span className="muted">{(selected.countrySlug || "").toUpperCase()}</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (field.type === "country") {
    const code = String(value || "").trim().toLowerCase();
    const flagSrc = flagImageUrl(code, 80);
    const countryLabel = (field.options || []).find((o) => o.value === code)?.label || "";
    return (
      <div className="span-full country-flag-row">
        <label className="field-block">
          <span className="field-label">{field.label || "Country"}</span>
          <select
            {...common}
            value={code}
            onChange={(e) => onChange(field.key, e.target.value)}
          >
            <option value="">Select country…</option>
            {(field.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hint}
        </label>
        <div className="field-block flag-preview-field">
          <span className="field-label">Flag</span>
          <div className={`flag-preview-box${flagSrc ? "" : " is-empty"}`}>
            {flagSrc ? (
              <img src={flagSrc} alt={countryLabel || code} title={countryLabel || code} />
            ) : (
              <span>Select a country</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (
    field.type === "textarea" ||
    field.type === "paragraphs" ||
    field.type === "pointlist" ||
    field.type === "json" ||
    field.type === "stringlist"
  ) {
    return (
      <label className={fieldClassName(field)}>
        <span className="field-label">{field.label}</span>
        <textarea
          {...common}
          rows={field.rows || (field.type === "stringlist" ? 4 : 6)}
          value={value ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={
            field.type === "pointlist"
              ? "spark | Title | Short description"
              : field.type === "paragraphs" || field.type === "stringlist"
                ? "One item per line"
                : undefined
          }
        />
        {hint}
      </label>
    );
  }

  if (field.key === "youtubeId") {
    const id = extractYoutubeId(value);
    const thumb = id ? youtubeThumbUrl(id) : "";
    return (
      <label className={fieldClassName(field)}>
        <span className="field-label">{field.label}</span>
        <div className="youtube-input-row">
          <input
            {...common}
            type="text"
            value={value ?? ""}
            placeholder="https://www.youtube.com/watch?v=… or video ID"
            onChange={(e) => onChange(field.key, e.target.value)}
            onBlur={(e) => {
              const cleaned = extractYoutubeId(e.target.value);
              if (cleaned && cleaned !== e.target.value.trim()) onChange(field.key, cleaned);
            }}
          />
          <button
            type="button"
            className="btn primary"
            disabled={!id || fetchingYoutube}
            onClick={() => onFetchYoutube?.(value)}
          >
            {fetchingYoutube ? "Fetching…" : "Fetch title & description"}
          </button>
        </div>
        {hint}
        {thumb ? (
          <div className="youtube-thumb-preview">
            <img src={thumb} alt="YouTube thumbnail preview" />
            {onUseYoutubeThumb ? (
              <button type="button" className="btn" onClick={onUseYoutubeThumb}>
                Apply as image
              </button>
            ) : null}
          </div>
        ) : null}
      </label>
    );
  }

  return (
    <label className={fieldClassName(field)}>
      <span className="field-label">{field.label}</span>
      <input
        {...common}
        type={field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {hint}
    </label>
  );
}
