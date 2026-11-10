import { useEffect, useState } from "react";
import { del, get, post, put } from "../api";
import ImageUpload from "../components/ImageUpload";
import { useAuth } from "../auth";
import { youtubeThumbUrl } from "../resources";

const EMPTY_SETTINGS = {
  heroImageUrl: "",
  showHeroText: false,
  tagline: "",
  presentedBy: "EDUCATION DOORWAY",
  about: "",
  aboutImageUrl: "",
  shortsIntro: "",
  playlistUrl: "",
  episodesPlaylistId: "",
  shortsPlaylistId: "",
  watchNowLabel: "Watch Now",
  playAllLabel: "Play all one by one",
  moreStoriesLabel: "More video stories",
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

export default function Doorcast() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "editor";
  const canDelete = user?.role === "admin";
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        showHeroText: Boolean(s.showHeroText),
        tagline: s.tagline || "",
        presentedBy: s.presentedBy || "EDUCATION DOORWAY",
        about: s.about || "",
        aboutImageUrl: s.aboutImageUrl || "",
        shortsIntro: s.shortsIntro || "",
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
      setVideos(Array.isArray(data.videos) ? data.videos : []);
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

  async function saveSettings(e) {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await put("/api/admin/doorcast/settings", settings);
      setMessage("Doorcast settings saved");
      load();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
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
      await put(`/api/admin/doorcast/videos/${id}`, { featured: true, published: true, kind: "episode" });
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
  const featured = episodes.find((v) => v.featured) || episodes[0] || null;

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading Doorcast…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Content</p>
          <h1>Doorcast</h1>
          <p className="muted">
            Each block below matches a section on the public /doorcast page. Save settings, then
            manage the Watch Now video and Shorts list.
          </p>
        </div>
      </header>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert ok">{message}</div> : null}

      <form className="panel" onSubmit={saveSettings}>
        <div className="panel-head">
          <h2>1 · Hero</h2>
          <p className="muted">Top full-bleed image. Optional logo + tagline overlay.</p>
        </div>

        <div className="form-grid">
          <ImageUpload
            label="Hero image"
            value={settings.heroImageUrl}
            onChange={(url) => setField("heroImageUrl", url)}
            kind="hero"
            hint="Full-bleed hero background — JPG/PNG/WebP"
          />

          <label className="span-2" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={settings.showHeroText}
              onChange={(e) => setField("showHeroText", e.target.checked)}
            />
            <span>Show text on hero (logo + tagline). Leave off for image-only hero.</span>
          </label>

          <label>
            Tagline
            <input
              value={settings.tagline}
              onChange={(e) => setField("tagline", e.target.value)}
              placeholder="Beyond the Conversation. Into Your Future."
              disabled={!settings.showHeroText}
            />
          </label>

          <label>
            Presented by
            <input
              value={settings.presentedBy}
              onChange={(e) => setField("presentedBy", e.target.value)}
            />
          </label>
        </div>

        <div className="panel-head" style={{ marginTop: 28 }}>
          <h2>2 · Watch Now video (left card)</h2>
          <p className="muted">
            This is the big play card (title, description, duration). Add/edit it in{" "}
            <strong>Videos</strong> below — mark one episode as <strong>Featured (Watch Now)</strong>,
            or sync a single YouTube video URL. Badge text is editable here.
          </p>
        </div>

        <div className="form-grid">
          <label>
            “Watch Now” badge label
            <input
              value={settings.watchNowLabel}
              onChange={(e) => setField("watchNowLabel", e.target.value)}
              placeholder="Watch Now"
            />
          </label>

          <div className="span-2" style={{ padding: "12px 14px", background: "#f4f6fb", borderRadius: 10 }}>
            {featured ? (
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <img
                  src={featured.imageUrl || youtubeThumbUrl(featured.youtubeId)}
                  alt=""
                  style={{ width: 120, height: 68, objectFit: "cover", borderRadius: 8 }}
                />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <strong>Current Watch Now:</strong> {featured.title}
                  {featured.duration ? <span className="muted"> · {featured.duration}</span> : null}
                  {featured.description ? (
                    <div className="muted" style={{ marginTop: 4, fontSize: 13 }}>
                      {featured.description}
                    </div>
                  ) : null}
                </div>
                <button type="button" className="btn sm" onClick={() => startEdit(featured)}>
                  Edit this video
                </button>
              </div>
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                No Watch Now video yet — use “Add episode” below or sync a YouTube video URL, then tick{" "}
                <strong>Featured (Watch Now)</strong>.
              </p>
            )}
          </div>
        </div>

        <div className="panel-head" style={{ marginTop: 28 }}>
          <h2>3 · About panel (right card)</h2>
          <p className="muted">About text + studio / host image behind the Doorcast logo panel.</p>
        </div>

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
            hint="Mic / host photo on the right about card (not circular). Leave empty to use default studio image."
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
            Channel / “Play all” URL
            <input
              type="url"
              value={settings.playlistUrl}
              onChange={(e) => setField("playlistUrl", e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
            />
          </label>
        </div>

        <div className="panel-head" style={{ marginTop: 28 }}>
          <h2>4 · Shorts section</h2>
          <p className="muted">Intro text + link under the shorts carousel. Videos themselves are synced below.</p>
        </div>

        <div className="form-grid">
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

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={saving || !canEdit}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>

      <div className="panel playlist-sync">
        <div className="panel-head">
          <strong>5 · YouTube sync</strong>
          <p className="muted">
            <strong>Watch Now:</strong> paste a single video URL (or playlist) → Sync episodes.{" "}
            <strong>Shorts slider:</strong> paste shorts playlist → Sync shorts.
          </p>
        </div>

        <div className="playlist-sync-row">
          <label className="grow">
            Watch Now — playlist or single video URL
            <input
              type="url"
              value={episodePlaylist}
              onChange={(e) => setEpisodePlaylist(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or playlist URL"
            />
          </label>
          <button
            type="button"
            className="btn primary"
            disabled={!!syncing || !canEdit}
            onClick={() => syncPlaylist("episode")}
          >
            {syncing === "episode" ? "Syncing…" : "Sync Watch Now / episodes"}
          </button>
        </div>

        <div className="playlist-sync-row" style={{ marginTop: 12 }}>
          <label className="grow">
            Shorts playlist (bottom carousel)
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
      </div>

      <div className="panel">
        <div className="panel-head row" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2>6 · Videos</h2>
            <p className="muted">
              {episodes.length} episode{episodes.length === 1 ? "" : "s"} · {shorts.length} short
              {shorts.length === 1 ? "" : "s"} — tick <strong>Featured (Watch Now)</strong> on the
              episode that should appear in the left card.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn" onClick={() => startAdd("episode")} disabled={!canEdit}>
              Add episode
            </button>
            <button type="button" className="btn" onClick={() => startAdd("short")} disabled={!canEdit}>
              Add short
            </button>
          </div>
        </div>

        {adding ? (
          <form className="form-grid" onSubmit={saveVideo} style={{ marginBottom: 20 }}>
            <label className="span-2">
              YouTube URL or ID
              <input
                required
                value={form.youtubeId}
                onChange={(e) => setForm((p) => ({ ...p, youtubeId: e.target.value }))}
                placeholder="https://youtube.com/watch?v=... or Shorts URL"
              />
            </label>
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Study in Malaysia?"
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
                <option value="episode">Episode (Watch Now card)</option>
                <option value="short">Short (bottom slider)</option>
              </select>
            </label>
            <label>
              Duration
              <input
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                placeholder="56 Min"
              />
            </label>
            <label className="span-2">
              Description (shown under title on Watch Now card)
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Real conversation on opportunities, costs, and pathways…"
              />
            </label>
            <div className="span-2">
              <ImageUpload
                label="Custom thumbnail (optional)"
                value={form.imageUrl}
                onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                kind="cover"
                hint="Leave empty to use YouTube thumbnail"
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              />
              <span>Featured (Watch Now) — left card on /doorcast</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
              />
              <span>Published</span>
            </label>
            <div className="form-actions span-2">
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
                    No videos yet — sync a playlist or add one manually.
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
                      {v.subtitle ? <div className="muted">{v.subtitle}</div> : null}
                      {v.description ? (
                        <div className="muted" style={{ fontSize: 12, maxWidth: 360 }}>
                          {v.description}
                        </div>
                      ) : null}
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
      </div>
    </div>
  );
}
