import { useEffect, useState } from "react";
import { get, put } from "../api";
import { useAuth } from "../auth";

const SOCIAL_FIELDS = [
  { key: "facebook", label: "Facebook URL", icon: "facebook" },
  { key: "instagram", label: "Instagram URL", icon: "instagram" },
  { key: "linkedin", label: "LinkedIn URL", icon: "linkedin" },
  { key: "youtube", label: "YouTube URL", icon: "youtube" },
];

const BASIC_FIELDS = [
  { key: "name", label: "Site name" },
  { key: "short", label: "Short name" },
  { key: "tagline", label: "Tagline", type: "textarea" },
  { key: "since", label: "Since", type: "number" },
  { key: "phone", label: "Phone" },
  { key: "phoneAlt", label: "Phone alt" },
  { key: "email", label: "Email" },
  { key: "hours", label: "Hours" },
  { key: "address", label: "Address", type: "textarea" },
  { key: "whatsapp", label: "WhatsApp link" },
];

function socialsToForm(socials) {
  const list = Array.isArray(socials) ? socials : [];
  const byIcon = Object.fromEntries(list.map((s) => [s.icon || s.label?.toLowerCase(), s]));
  return {
    facebook: byIcon.facebook?.href || "",
    instagram: byIcon.instagram?.href || "",
    linkedin: byIcon.linkedin?.href || "",
    youtube: byIcon.youtube?.href || "",
  };
}

function formToSocials(form) {
  return SOCIAL_FIELDS.map((f) => ({
    label: f.label.replace(" URL", ""),
    href: String(form[f.key] || "").trim() || "#",
    icon: f.icon,
  }));
}

function statsToForm(stats) {
  const list = Array.isArray(stats) ? stats : [];
  return [0, 1, 2, 3].map((i) => ({
    value: list[i]?.value ?? "",
    suffix: list[i]?.suffix ?? "+",
    label: list[i]?.label ?? "",
  }));
}

function formToStats(rows) {
  return rows
    .filter((r) => String(r.label || "").trim() || String(r.value || "").trim())
    .map((r) => ({
      value: Number(r.value) || 0,
      suffix: String(r.suffix || "").trim(),
      label: String(r.label || "").trim(),
    }));
}

export default function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [values, setValues] = useState(null);
  const [socials, setSocials] = useState(socialsToForm([]));
  const [stats, setStats] = useState(statsToForm([]));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get("/api/admin/settings")
      .then((data) => {
        setValues(data);
        setSocials(socialsToForm(data.socials));
        setStats(statsToForm(data.stats));
      })
      .catch((err) => setError(err.message));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!isAdmin) return;
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const payload = { ...values };
      payload.since = Number(payload.since) || 0;
      payload.socials = formToSocials(socials);
      payload.stats = formToStats(stats);
      delete payload.id;
      delete payload.key;
      delete payload.createdAt;
      delete payload.updatedAt;
      const saved = await put("/api/admin/settings", payload);
      setValues(saved);
      setSocials(socialsToForm(saved.socials));
      setStats(statsToForm(saved.stats));
      setMessage("Settings saved");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!values && !error) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="muted">Site-wide contact and brand details.</p>
      </header>

      {!isAdmin && (
        <div className="alert">Only admins can update settings. You can view them.</div>
      )}
      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert ok">{message}</div>}

      {values && (
        <form className="edit-form" onSubmit={onSubmit}>
          <section className="panel">
            <div className="panel-head">
              <h2>Brand & contact</h2>
            </div>
            <div className="form-grid">
              {BASIC_FIELDS.map((field) => (
                <label key={field.key} className={field.type === "textarea" ? "span-2" : undefined}>
                  <span>{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={values[field.key] ?? ""}
                      disabled={!isAdmin}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={values[field.key] ?? ""}
                      disabled={!isAdmin}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Social links</h2>
              <p className="muted">Paste full profile URLs. Leave blank to use #.</p>
            </div>
            <div className="form-grid">
              {SOCIAL_FIELDS.map((field) => (
                <label key={field.key} className="span-2">
                  <span>{field.label}</span>
                  <input
                    type="url"
                    placeholder={`https://…`}
                    value={socials[field.key] ?? ""}
                    disabled={!isAdmin}
                    onChange={(e) => setSocials((s) => ({ ...s, [field.key]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Homepage stats</h2>
              <p className="muted">Numbers shown in the site counters (value, suffix, label).</p>
            </div>
            <div className="stats-edit-grid">
              {stats.map((row, i) => (
                <div key={i} className="stats-edit-row">
                  <label>
                    <span>Value</span>
                    <input
                      type="number"
                      value={row.value}
                      disabled={!isAdmin}
                      onChange={(e) =>
                        setStats((rows) => rows.map((r, idx) => (idx === i ? { ...r, value: e.target.value } : r)))
                      }
                    />
                  </label>
                  <label>
                    <span>Suffix</span>
                    <input
                      type="text"
                      placeholder="+"
                      value={row.suffix}
                      disabled={!isAdmin}
                      onChange={(e) =>
                        setStats((rows) => rows.map((r, idx) => (idx === i ? { ...r, suffix: e.target.value } : r)))
                      }
                    />
                  </label>
                  <label className="span-grow">
                    <span>Label</span>
                    <input
                      type="text"
                      placeholder="Students Placed"
                      value={row.label}
                      disabled={!isAdmin}
                      onChange={(e) =>
                        setStats((rows) => rows.map((r, idx) => (idx === i ? { ...r, label: e.target.value } : r)))
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {isAdmin && (
            <div className="form-actions">
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? "Saving…" : "Save settings"}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
