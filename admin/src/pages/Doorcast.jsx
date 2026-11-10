import { useEffect, useState } from "react";
import { del, get, post, put } from "../api";
import ImageUpload from "../components/ImageUpload";
import { useAuth } from "../auth";
import { extractYoutubeId, youtubeThumbUrl } from "../resources";

const EMPTY_SETTINGS = {
  heroImageUrl: "",
  heroLogoUrl: "",
  showHeroText: true,
  tagline: "",
  presentedBy: "EDUCATION DOORWAY",
  brandLogoUrl: "",
  about: "",
  aboutImageUrl: "",
  aboutLogoUrl: "",
  shortsIntro: "",
  shortsLogoUrl: "",
  shortsBrandLogoUrl: "",
  playlistUrl: "",
  episodesPlaylistId: "",
  shortsPlaylistId: "",
  watchNowLabel: "Watch Now",
  playAllLabel: "Play all one by one",
  moreStoriesLabel: "More video stories",
};

const EMPTY_FEATURED = {
  youtubeId: "",
  title: "",
  description: "",
  duration: "",
  imageUrl: "",
};

const EMPTY_VIDEO = {
  youtubeId: "",
  title: "",
  subtitle: "",
  description: "",
  duration: "",
  imageUrl: "",
  kind: "episode",
  featured: false,
  published: true,
  sortOrder: 0,
};

function Section({ num, title, hint, children, accent }) {
  return (
    <section className="dc-section">
      <div className="dc-section-head">
        <span className="dc-section-num" style={accent ? { background: accent } : undefined}>
          {num}
        </span>
        <div>
          <h2>{title}</h2>
          {hint ? <p className="muted">{hint}</p> : null}
        </div>
      </div>
      <div className="dc-section-body">{children}</div>
    </section>
  );
}

export default function Doorcast() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "editor";
  const canDelete = user?.role === "admin";
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [featuredForm, setFeaturedForm] = useState(EMPTY_FEATURED);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFeatured, setSavingFeatured] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [episodePlaylist, setEpisodePlaylist] = useState("");
  const [shortsPlaylist, setShortsPlaylist] = useState("");
  const [syncing, setSyncing] = useState("");
  const [form, setForm] = useState(EMPTY_VIDEO);
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await get("/api/admin/doorcast");
      const s = data.settings || {};
      setSettings({
        heroImageUrl: s.heroImageUrl || "",
        heroLogoUrl: s.heroLogoUrl || "",
        showHeroText: s.showHeroText !== false,
        tagline: s.tagline || "",
        presentedBy: s.presentedBy || "EDUCATION DOORWAY",
        brandLogoUrl: s.brandLogoUrl || "",
        about: s.about || "",
        aboutImageUrl: s.aboutImageUrl || "",
        aboutLogoUrl: s.aboutLogoUrl || "",
        shortsIntro: s.shortsIntro || "",
        shortsLogoUrl: s.shortsLogoUrl || "",
        shortsBrandLogoUrl: s.shortsBrandLogoUrl || "",
        playlistUrl: s.playlistUrl || "",
        episodesPlaylistId: s.episodesPlaylistId || "",
        shortsPlaylistId: s.shortsPlaylistId || "",
        watchNowLabel: s.watchNowLabel || "Watch Now",
        playAllLabel: s.playAllLabel || "Play all one by one",
        moreStoriesLabel: s.moreStoriesLabel || "More video stories",
      });
      setEpisodePlaylist(
        s.episodesPlaylistId
          ? `https://www.youtube.com/playlist?list=${s.episodesPlaylistId}`
          : ""
      );
      setShortsPlaylist(
        s.shortsPlaylistId ? `https://www.youtube.com/playlist?list=${s.shortsPlaylistId}` : ""
      );
      const list = Array.isArray(data.videos) ? data.videos : [];
      setVideos(list);
      const featured =
        list.find((v) => v.kind === "episode" && v.featured) ||
        list.find((v) => v.kind === "episode") ||
        null;
      setFeaturedForm(
        featured
          ? {
              youtubeId: featured.youtubeId || "",
              title: featured.title || "",
              description: featured.description || "",
              duration: featured.duration || "",
              imageUrl: featured.imageUrl || "",
            }
          : EMPTY_FEATURED
      );
    } catch (err) {
      setError(err.message || "Failed to load Doorcast");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function setField(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function setFeaturedField(key, value) {
    setFeaturedForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveSettings(e) {
    e?.preventDefault?.();
    if (!canEdit) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await put("/api/admin/doorcast/settings", settings);
      setMessage("Doorcast settings saved — live on /doorcast");
      load();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveFeatured(e) {
    e.preventDefault();
    if (!canEdit) return;
    setSavingFeatured(true);
    setError("");
    setMessage("");
    try {
      await put("/api/admin/doorcast/settings", {
        watchNowLabel: settings.watchNowLabel,
      });
      await put("/api/admin/doorcast/featured", featuredForm);
      setMessage("Watch Now video saved");
      load();
    } catch (err) {
      setError(err.message || "Could not save Watch Now video");
    } finally {
      setSavingFeatured(false);
    }
  }

  async function syncPlaylist(kind) {
    if (!canEdit) return;
    const playlistUrl = kind === "episode" ? episodePlaylist : shortsPlaylist;
    if (!playlistUrl.trim()) {
      setError("Paste a YouTube playlist URL first");
      return;
    }
    setSyncing(kind);
    setError("");
    setMessage("");
    try {
      const result = await post("/api/admin/doorcast/sync-playlist", {
        kind,
        playlistUrl: playlistUrl.trim(),
      });
      setMessage(
        result.mode === "single"
          ? `Synced 1 ${kind} video (Watch Now)${result.youtubeId ? ` · ${result.youtubeId}` : ""}`
          : `Synced ${kind}s: ${result.created} new, ${result.updated} updated` +
              (result.skipped ? `, ${result.skipped} skipped` : "") +
              (result.playlistTitle ? ` · ${result.playlistTitle}` : "")
      );
      load();
    } catch (err) {
      setError(err.message || "Playlist sync failed");
    } finally {
      setSyncing("");
    }
  }

  function startEdit(video) {
    setEditingId(video.id);
    setForm({
      youtubeId: video.youtubeId || "",
      title: video.title || "",
      subtitle: video.subtitle || "",
      description: video.description || "",
      duration: video.duration || "",
      imageUrl: video.imageUrl || "",
      kind: video.kind || "episode",
      featured: Boolean(video.featured),
      published: video.published !== false,
      sortOrder: video.sortOrder ?? 0,
    });
    setAdding(true);
  }

  function startAdd(kind = "episode") {
    setEditingId(null);
    setForm({ ...EMPTY_VIDEO, kind, featured: kind === "episode" });
    setAdding(true);
  }

  async function saveVideo(e) {
    e.preventDefault();
    if (!canEdit) return;
    setAdding(true);
    setError("");
    setMessage("");
    try {
      if (editingId) {
        await put(`/api/admin/doorcast/videos/${editingId}`, form);
        setMessage("Video updated");
      } else {
        await post("/api/admin/doorcast/videos", form);
        setMessage("Video added");
      }
      setAdding(false);
      setEditingId(null);
      setForm(EMPTY_VIDEO);
      load();
    } catch (err) {
      setError(err.message || "Could not save video");
    }
  }

  async function setFeatured(id) {
    if (!canEdit) return;
    setError("");
    setMessage("");
    try {
      await put(`/api/admin/doorcast/videos/${id}`, {
        featured: true,
        published: true,
        kind: "episode",
      });
      setMessage("Watch Now video updated");
      load();
    } catch (err) {
      setError(err.message || "Could not set featured video");
    }
  }

  async function removeVideo(id, title) {
    if (!canDelete) return;
    if (!window.confirm(`Delete “${title}”?`)) return;
    try {
      await del(`/api/admin/doorcast/videos/${id}`);
      setMessage("Video deleted");
      load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  const episodes = videos.filter((v) => v.kind === "episode");
  const shorts = videos.filter((v) => v.kind === "short");

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading Doorcast…</p>
      </div>
    );
  }

  return (
    <div className="page dc-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Content</p>
          <h1>Doorcast</h1>
          <p className="muted">
            Edit the public page section by section — same order as /doorcast.
          </p>
        </div>
      </header>

      <div className="dc-map">
        <strong>Page map:</strong> 1 Banner → 2 Watch Now (left) + 3 About (right) → 4 Shorts →
        counselling form (site-wide)
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert ok">{message}</div> : null}

      {/* 1 Banner */}
      <Section
        num="1"
        title="Banner"
        hint="Top full-bleed image. Choose image-only, or show Doorcast logo + Presented by + tagline (matches your layout)."
      >
        <div className="dc-mode" role="group" aria-label="Banner mode">
          <button
            type="button"
            className={`dc-mode-btn${settings.showHeroText ? " active" : ""}`}
            onClick={() => setField("showHeroText", true)}
            disabled={!canEdit}
          >
            <strong>Banner with text</strong>
            <span>Shows Doorcast logo, Presented by, and tagline over the image (recommended).</span>
          </button>
          <button
            type="button"
            className={`dc-mode-btn${!settings.showHeroText ? " active" : ""}`}
            onClick={() => setField("showHeroText", false)}
            disabled={!canEdit}
          >
            <strong>Image only</strong>
            <span>Only the banner photo — no logos or tagline overlay.</span>
          </button>
        </div>

        <div className="form-grid">
          <ImageUpload
            label="Banner background image"
            value={settings.heroImageUrl}
            onChange={(url) => setField("heroImageUrl", url)}
            kind="hero"
            hint="ON AIR / studio photo — full width"
          />
        </div>

        {settings.showHeroText ? (
          <div className="dc-subcard">
            <h3>Text on banner (live when mode = Banner with text)</h3>
            <div className="form-grid">
              <ImageUpload
                label="Doorcast logo on banner"
                value={settings.heroLogoUrl}
                onChange={(url) => setField("heroLogoUrl", url)}
                kind="doorcastLogo"
                hint="Saved at 500×300. Empty = default DOORCAST wordmark"
              />
              <ImageUpload
                label="Presented-by brand logo (banner only)"
                value={settings.brandLogoUrl}
                onChange={(url) => setField("brandLogoUrl", url)}
                kind="doorcastLogo"
                hint="Banner only — 500×300. Shorts has its own logo below."
              />
              <label>
                Tagline
                <input
                  value={settings.tagline}
                  onChange={(e) => setField("tagline", e.target.value)}
                  placeholder="Beyond the Conversation. Into Your Future."
                />
              </label>
              <label>
                Presented by (text)
                <input
                  value={settings.presentedBy}
                  onChange={(e) => setField("presentedBy", e.target.value)}
                />
              </label>
            </div>
          </div>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            Text fields are hidden because Image only is selected. Switch to{" "}
            <strong>Banner with text</strong> to edit logo + tagline.
          </p>
        )}

        <div className="dc-actions">
          <button
            type="button"
            className="btn primary"
            disabled={saving || !canEdit}
            onClick={saveSettings}
          >
            {saving ? "Saving…" : "Save banner"}
          </button>
        </div>
      </Section>

      {/* 2 Watch Now */}
      <Section
        num="2"
        title="Watch Now video (left card)"
        hint="Paste a YouTube link → thumbnail is added automatically. Title/description auto-fill on save if left empty."
        accent="#c8102e"
      >
        <form className="form-grid" onSubmit={saveFeatured}>
          <label>
            “Watch Now” badge label
            <input
              value={settings.watchNowLabel}
              onChange={(e) => setField("watchNowLabel", e.target.value)}
              placeholder="Watch Now"
            />
          </label>
          <label className="span-2">
            YouTube video URL or ID
            <input
              required
              value={featuredForm.youtubeId}
              onChange={(e) => setFeaturedField("youtubeId", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
            />
            <small className="field-hint">
              Example: https://www.youtube.com/watch?v=… or https://youtu.be/…
            </small>
          </label>

          {(() => {
            const id = extractYoutubeId(featuredForm.youtubeId);
            const ytThumb = id ? youtubeThumbUrl(id) : "";
            const custom = String(featuredForm.imageUrl || "").trim();
            const customIsYoutube = /ytimg\.com\/vi\//i.test(custom);
            const useCustom = custom && !customIsYoutube && !/\/maxresdefault\.jpg$/i.test(custom);
            const preview = useCustom ? custom : ytThumb;
            if (!preview) return null;
            return (
              <div className="span-2 dc-subcard" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <img
                  src={preview.startsWith("http") || preview.startsWith("/") ? preview : preview}
                  alt=""
                  style={{ width: 160, height: 90, objectFit: "cover", borderRadius: 10, background: "#111" }}
                  onError={(e) => {
                    if (ytThumb && e.currentTarget.src !== ytThumb) e.currentTarget.src = ytThumb;
                  }}
                />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <strong>{useCustom ? "Custom thumbnail" : "YouTube thumbnail (auto)"}</strong>
                  <p className="muted" style={{ margin: "4px 0 8px" }}>
                    {useCustom
                      ? "A custom image is set. Remove it below to use YouTube’s thumb."
                      : "Auto from YouTube — click Save Watch Now video to store it."}
                  </p>
                  {useCustom || customIsYoutube ? (
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => setFeaturedField("imageUrl", ytThumb || "")}
                    >
                      Use YouTube thumbnail
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })()}

          <label>
            Title (optional — auto from YouTube)
            <input
              value={featuredForm.title}
              onChange={(e) => setFeaturedField("title", e.target.value)}
              placeholder="Study in Malaysia?"
            />
          </label>
          <label>
            Duration
            <input
              value={featuredForm.duration}
              onChange={(e) => setFeaturedField("duration", e.target.value)}
              placeholder="56 Min"
            />
          </label>
          <label className="span-2">
            Description (optional — auto from YouTube)
            <textarea
              rows={2}
              value={featuredForm.description}
              onChange={(e) => setFeaturedField("description", e.target.value)}
              placeholder="Real conversation on opportunities, costs, and pathways…"
            />
          </label>
          <ImageUpload
            label="Custom thumbnail (optional)"
            value={
              featuredForm.imageUrl &&
              !/ytimg\.com\/vi\//i.test(featuredForm.imageUrl) &&
              !/\/maxresdefault\.jpg$/i.test(featuredForm.imageUrl)
                ? featuredForm.imageUrl
                : ""
            }
            onChange={(url) => setFeaturedField("imageUrl", url)}
            kind="cover"
            hint="Leave empty — YouTube thumbnail is used automatically. If you see a gray box, click Remove then Save."
          />
          <div className="dc-actions span-2">
            <button type="submit" className="btn primary" disabled={savingFeatured || !canEdit}>
              {savingFeatured ? "Saving…" : "Save Watch Now video"}
            </button>
          </div>
        </form>
      </Section>

      {/* 3 About */}
      <Section
        num="3"
        title="About panel (right card)"
        hint="Mic / host image + Doorcast logo + about text + Play all button."
      >
        <div className="form-grid">
          <label className="span-2">
            About Doorcast
            <textarea
              rows={4}
              value={settings.about}
              onChange={(e) => setField("about", e.target.value)}
            />
          </label>
          <ImageUpload
            label="About portrait / host image"
            value={settings.aboutImageUrl}
            onChange={(url) => setField("aboutImageUrl", url)}
            kind="cover"
            hint="Studio mic / host photo"
          />
          <ImageUpload
            label="About Doorcast logo"
            value={settings.aboutLogoUrl}
            onChange={(url) => setField("aboutLogoUrl", url)}
            kind="doorcastLogo"
            hint="Saved at 500×300. Empty = default wordmark"
          />
          <label>
            “Play all” button label
            <input
              value={settings.playAllLabel}
              onChange={(e) => setField("playAllLabel", e.target.value)}
              placeholder="Play all one by one"
            />
          </label>
          <label>
            Play all / channel URL
            <input
              type="url"
              value={settings.playlistUrl}
              onChange={(e) => setField("playlistUrl", e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
            />
          </label>
        </div>
        <div className="dc-actions">
          <button
            type="button"
            className="btn primary"
            disabled={saving || !canEdit}
            onClick={saveSettings}
          >
            {saving ? "Saving…" : "Save about panel"}
          </button>
        </div>
      </Section>

      {/* 4 Shorts */}
      <Section
        num="4"
        title="Shorts section"
        hint="Logo + intro text on the left; vertical shorts carousel on the right."
      >
        <div className="form-grid">
          <ImageUpload
            label="Shorts Doorcast logo"
            value={settings.shortsLogoUrl}
            onChange={(url) => setField("shortsLogoUrl", url)}
            kind="doorcastLogo"
            hint="Separate from banner — saved at 500×300"
          />
          <ImageUpload
            label="Shorts Presented-by brand logo"
            value={settings.shortsBrandLogoUrl}
            onChange={(url) => setField("shortsBrandLogoUrl", url)}
            kind="doorcastLogo"
            hint="Separate from banner brand logo — 500×300"
          />
          <label className="span-2">
            Shorts intro text
            <textarea
              rows={2}
              value={settings.shortsIntro}
              onChange={(e) => setField("shortsIntro", e.target.value)}
            />
          </label>
          <label className="span-2">
            “More video stories” link label
            <input
              value={settings.moreStoriesLabel}
              onChange={(e) => setField("moreStoriesLabel", e.target.value)}
              placeholder="More video stories"
            />
          </label>
        </div>
        <div className="dc-actions">
          <button
            type="button"
            className="btn primary"
            disabled={saving || !canEdit}
            onClick={saveSettings}
          >
            {saving ? "Saving…" : "Save shorts section"}
          </button>
        </div>
      </Section>

      <Section
        num="5"
        title="YouTube sync"
        hint="Bulk import. Prefer section 2 for the single Watch Now video."
      >
        <div className="playlist-sync-row">
          <label className="grow">
            Episodes playlist (optional)
            <input
              type="url"
              value={episodePlaylist}
              onChange={(e) => setEpisodePlaylist(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
            />
          </label>
          <button
            type="button"
            className="btn primary"
            disabled={!!syncing || !canEdit}
            onClick={() => syncPlaylist("episode")}
          >
            {syncing === "episode" ? "Syncing…" : "Sync episodes"}
          </button>
        </div>
        <div className="playlist-sync-row" style={{ marginTop: 4 }}>
          <label className="grow">
            Shorts playlist (carousel)
            <input
              type="url"
              value={shortsPlaylist}
              onChange={(e) => setShortsPlaylist(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
            />
          </label>
          <button
            type="button"
            className="btn primary"
            disabled={!!syncing || !canEdit}
            onClick={() => syncPlaylist("short")}
          >
            {syncing === "short" ? "Syncing…" : "Sync shorts"}
          </button>
        </div>
      </Section>

      <Section num="6" title="All videos" hint={`${episodes.length} episodes · ${shorts.length} shorts`}>
        <div className="dc-actions" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn" onClick={() => startAdd("episode")} disabled={!canEdit}>
            Add episode
          </button>
          <button type="button" className="btn" onClick={() => startAdd("short")} disabled={!canEdit}>
            Add short
          </button>
        </div>

        {adding ? (
          <form className="form-grid" onSubmit={saveVideo}>
            <label className="span-2">
              YouTube URL or ID
              <input
                required
                value={form.youtubeId}
                onChange={(e) => setForm((p) => ({ ...p, youtubeId: e.target.value }))}
              />
            </label>
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </label>
            <label>
              Subtitle
              <input
                value={form.subtitle}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </label>
            <label>
              Kind
              <select
                value={form.kind}
                onChange={(e) => setForm((p) => ({ ...p, kind: e.target.value }))}
              >
                <option value="episode">Episode (Watch Now)</option>
                <option value="short">Short (carousel)</option>
              </select>
            </label>
            <label>
              Duration
              <input
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              />
            </label>
            <label className="span-2">
              Description
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </label>
            <div className="span-2">
              <ImageUpload
                label="Thumbnail"
                value={form.imageUrl}
                onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                kind="cover"
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              />
              <span>Featured (Watch Now)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
              />
              <span>Published</span>
            </label>
            <div className="dc-actions span-2">
              <button type="submit" className="btn primary">
                {editingId ? "Update video" : "Add video"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setAdding(false);
                  setEditingId(null);
                  setForm(EMPTY_VIDEO);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Thumb</th>
                <th>Title</th>
                <th>Kind</th>
                <th>Flags</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    No videos yet — use section 2 or sync shorts.
                  </td>
                </tr>
              ) : (
                videos.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <img
                        src={v.imageUrl || youtubeThumbUrl(v.youtubeId)}
                        alt=""
                        style={{ width: 72, height: 40, objectFit: "cover", borderRadius: 6 }}
                      />
                    </td>
                    <td>
                      <strong>{v.title}</strong>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {v.youtubeId}
                        {v.duration ? ` · ${v.duration}` : ""}
                      </div>
                    </td>
                    <td>
                      <span className="badge">{v.kind}</span>
                    </td>
                    <td>
                      {v.featured ? <span className="badge ok">Watch Now</span> : null}{" "}
                      {v.published ? (
                        <span className="badge ok">live</span>
                      ) : (
                        <span className="badge">draft</span>
                      )}
                    </td>
                    <td className="row-actions">
                      {v.kind === "episode" && !v.featured ? (
                        <button
                          type="button"
                          className="btn sm"
                          disabled={!canEdit}
                          onClick={() => setFeatured(v.id)}
                        >
                          Set Watch Now
                        </button>
                      ) : null}
                      <button type="button" className="btn sm" onClick={() => startEdit(v)}>
                        Edit
                      </button>
                      {canDelete ? (
                        <button
                          type="button"
                          className="btn sm danger"
                          onClick={() => removeVideo(v.id, v.title)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
