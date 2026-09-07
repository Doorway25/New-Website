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

export default function ImageUpload({
  label = "Image",
  value,
  onChange,
  required = false,
  kind = "cover",
  hint = "JPG, PNG, WebP · auto-resized & compressed to WebP",
}) {
  const { user } = useAuth();
  const canDelete = user?.role === "admin";
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(null);

  const preset =
    kind === "logo"
      ? { maxWidth: 256, quality: 70, kind: "logo" }
      : kind === "thumb"
        ? { maxWidth: 640, quality: 62, kind: "thumb" }
        : { maxWidth: 960, quality: 64, kind: "cover" };

  async function removeCurrentFile() {
    if (!canDelete || !isManagedUpload(value)) return;
    try {
      await deleteUpload(value);
    } catch {
      // still clear UI even if file already gone
    }
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setInfo(null);
    setUploading(true);
    try {
      const data = await uploadImage(file, {
        ...preset,
        replace: canDelete && isManagedUpload(value) ? value : undefined,
      });
      onChange(data.url);
      setInfo({
        size: data.size,
        originalSize: data.originalSize,
        width: data.width,
        height: data.height,
      });
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onRemove() {
    setError("");
    setUploading(true);
    try {
      if (canDelete && isManagedUpload(value)) {
        await removeCurrentFile();
      }
      onChange("");
      setInfo(null);
    } catch (err) {
      setError(err.message || "Could not remove image");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="image-upload span-2">
      <span className="image-upload-label">
        {label}
        {required ? " *" : ""}
      </span>

      <div className="image-upload-box">
        {value ? (
          <div className="image-preview">
            <img src={mediaUrl(value)} alt="" loading="lazy" decoding="async" />
            <div className="image-preview-actions">
              <label className="btn">
                {uploading ? "Optimizing…" : "Replace / upload"}
                <input type="file" accept="image/*" hidden disabled={uploading} onChange={onFile} />
              </label>
              <button type="button" className="btn ghost" disabled={uploading} onClick={onRemove}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className={`image-drop ${uploading ? "busy" : ""}`}>
            <strong>{uploading ? "Optimizing for web…" : "Choose image"}</strong>
            <span>{hint}</span>
            <input type="file" accept="image/*" hidden disabled={uploading} onChange={onFile} />
          </label>
        )}
      </div>

      {info && (
        <p className="muted image-meta">
          Saved {info.width}×{info.height} WebP
          {info.originalSize
            ? ` · ${formatBytes(info.size)} (was ${formatBytes(info.originalSize)})`
            : ` · ${formatBytes(info.size)}`}
        </p>
      )}
      {error && <p className="field-error">{error}</p>}
      {required && !value ? <input tabIndex={-1} className="sr-only" required value="" onChange={() => {}} /> : null}
    </div>
  );
}

function formatBytes(n) {
  if (!n && n !== 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
