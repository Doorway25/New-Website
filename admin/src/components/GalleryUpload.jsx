import { useState } from "react";
import { deleteUpload, uploadImage } from "../api";
import { useAuth } from "../auth";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function mediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("blob:")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function isManagedUpload(url) {
  return typeof url === "string" && url.includes("/uploads/");
}

export default function GalleryUpload({
  label = "Gallery images",
  value = [],
  onChange,
  hint = "Upload multiple event photos for the public gallery",
}) {
  const { user } = useAuth();
  const canDelete = user?.role === "admin";
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const urls = Array.isArray(value) ? value.filter(Boolean) : [];

  async function onFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    setUploading(true);
    try {
      const next = [...urls];
      for (const file of files) {
        const data = await uploadImage(file, { maxWidth: 1200, quality: 68, kind: "hero" });
        if (data?.url) next.push(data.url);
      }
      onChange(next);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onRemove(index) {
    const target = urls[index];
    setError("");
    setUploading(true);
    try {
      if (canDelete && isManagedUpload(target)) {
        try {
          await deleteUpload(target);
        } catch {
          // still remove from list
        }
      }
      onChange(urls.filter((_, i) => i !== index));
    } catch (err) {
      setError(err.message || "Could not remove image");
    } finally {
      setUploading(false);
    }
  }

  function move(index, dir) {
    const next = [...urls];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  }

  return (
    <div className="image-upload span-2 gallery-upload">
      <span className="image-upload-label">{label}</span>
      <p className="muted" style={{ margin: 0, fontSize: "0.82rem" }}>
        {hint}
      </p>

      <div className="gallery-grid">
        {urls.map((url, i) => (
          <div key={`${url}-${i}`} className="gallery-item">
            <img src={mediaUrl(url)} alt="" loading="lazy" decoding="async" />
            <div className="gallery-item-actions">
              <button type="button" className="btn ghost" disabled={uploading || i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" className="btn ghost" disabled={uploading || i === urls.length - 1} onClick={() => move(i, 1)}>
                ↓
              </button>
              <button type="button" className="btn ghost" disabled={uploading} onClick={() => onRemove(i)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        <label className={`image-drop gallery-add ${uploading ? "busy" : ""}`}>
          <strong>{uploading ? "Uploading…" : "Add images"}</strong>
          <span>JPG, PNG, WebP · multiple allowed</span>
          <input type="file" accept="image/*" multiple hidden disabled={uploading} onChange={onFiles} />
        </label>
      </div>

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
