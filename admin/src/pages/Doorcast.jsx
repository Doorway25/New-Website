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
};

const EMPTY_VIDEO = {
  youtubeId: "",
  title: "",
  subtitle: "",
  description: "",
  duration: "",
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
      kind: video.kind || "episode",
      featured: Boolean(video.featured),
      published: video.published !== false,
      sortOrder: video.sortOrder ?? 0,
    });
    setAdding(true);
  }

  function startAdd(kind = "episode") {
    setEditingId(null);
    setForm({ ...EMPTY_VIDEO, kind });
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
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Content</p>
          <h1>Doorcast</h1>
          <p className="muted">
            Control hero image, about text, featured episodes, and shorts slider. Upload videos to
            YouTube, then sync playlists here — they appear on the public /doorcast page.
          </p>
        </div>
      </header>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert ok">{message}</div> : null}

      <form className="panel" onSubmit={saveSettings}>
        <div className="panel-head">
          <h2>Page settings</h2>
          <p className="muted">Hero image (default: image only). Optionally show tagline text over the image.</p>
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
            kind="thumb"
            hint="Circular image next to about text"
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
            Channel / “Play all” URL
            <input
              type="url"
              value={settings.playlistUrl}
              onChange={(e) => setField("playlistUrl", e.target.value)}
              placeholder="https://www.youtube.com/@EducationDoorway/videos"
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
          <strong>YouTube playlist sync</strong>
          <p className="muted">
            Episodes (Watch Now): paste a playlist URL or a single video URL, then Sync. Shorts:
            paste the shorts playlist URL for the bottom slider.
          </p>
        </div>

        <div className="playlist-sync-row">
          <label className="grow">
            Episodes playlist or video URL
            <input
              type="url"
              value={episodePlaylist}
              onChange={(e) => setEpisodePlaylist(e.target.value)}
              placeholder="Playlist or single video — e.g. https://www.youtube.com/playlist?list=PLTxqWjoR7G9A"
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

        <div className="playlist-sync-row" style={{ marginTop: 12 }}>
          <label className="grow">
            Shorts playlist (slider)
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
            <h2>Videos</h2>
            <p className="muted">
              {episodes.length} episode{episodes.length === 1 ? "" : "s"} · {shorts.length} short
              {shorts.length === 1 ? "" : "s"}
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
                placeholder="Auto-fills from YouTube if left blank on add"
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
                <option value="episode">Episode (featured / Watch Now)</option>
                <option value="short">Short (slider)</option>
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
              Description
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </label>
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
                      <div className="muted" style={{ fontSize: 12 }}>
                        {v.youtubeId}
                      </div>
                    </td>
                    <td>
                      <span className="badge">{v.kind}</span>
                    </td>
                    <td>
                      {v.featured ? <span className="badge ok">featured</span> : null}{" "}
                      {v.published ? (
                        <span className="badge ok">live</span>
                      ) : (
                        <span className="badge">draft</span>
                      )}
                    </td>
                    <td className="row-actions">
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
