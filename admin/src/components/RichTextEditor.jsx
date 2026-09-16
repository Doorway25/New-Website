import { useEffect, useId, useRef, useState } from "react";
import { uploadImage } from "../api";
import { extractYoutubeId, youtubeThumbUrl } from "../resources";

const INLINE = [
  { cmd: "bold", label: "B", title: "Bold" },
  { cmd: "italic", label: "I", title: "Italic" },
  { cmd: "underline", label: "U", title: "Underline" },
];

const LISTS = [
  { cmd: "insertUnorderedList", label: "• List", title: "Bullet list" },
  { cmd: "insertOrderedList", label: "1. List", title: "Numbered list" },
];

const BLOCKS = [
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

const WIDTH_PRESETS = [
  { value: 40, label: "S" },
  { value: 60, label: "M" },
  { value: 80, label: "L" },
  { value: 100, label: "Full" },
];

function normalizeHtml(html) {
  const s = String(html || "").trim();
  if (!s || s === "<br>" || s === "<div><br></div>") return "";
  return s;
}

/** Strip editor-only chrome before saving */
function serializeEditorHtml(root) {
  const clone = root.cloneNode(true);
  clone.querySelectorAll(".rt-img-controls, .rt-resize-handle, .rt-selected").forEach((n) => {
    n.classList?.remove?.("rt-selected");
    if (n.classList?.contains("rt-img-controls") || n.classList?.contains("rt-resize-handle")) {
      n.remove();
    }
  });
  clone.querySelectorAll(".rt-selected").forEach((n) => n.classList.remove("rt-selected"));
  return normalizeHtml(clone.innerHTML);
}

function youtubeFigureHtml(id) {
  const thumb = youtubeThumbUrl(id);
  return (
    `<figure class="article-youtube" data-youtube-id="${id}" contenteditable="false">` +
    `<div class="article-youtube-frame">` +
    `<img class="article-youtube-thumb" src="${thumb}" alt="YouTube video" loading="lazy" />` +
    `<span class="article-youtube-play" aria-hidden="true"></span>` +
    `</div>` +
    `<figcaption><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>` +
    `</figure>`
  );
}

function infographicFigureHtml(url, width = 100) {
  const w = Math.min(100, Math.max(20, Number(width) || 100));
  return (
    `<figure class="article-infographic" contenteditable="false" data-width="${w}" style="width:${w}%">` +
    `<img src="${url}" alt="Infographic" />` +
    `</figure>`
  );
}

/**
 * WYSIWYG editor that stores HTML.
 * Supports infographic images (manual resize) and YouTube paste → 16:9 embed.
 */
export default function RichTextEditor({ label, value = "", onChange, required = false }) {
  const ref = useRef(null);
  const fileRef = useRef(null);
  const lastEmitted = useRef(normalizeHtml(value));
  const skipSync = useRef(false);
  const blockId = useId();
  const [uploading, setUploading] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [selectedWidth, setSelectedWidth] = useState(100);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (skipSync.current) {
      skipSync.current = false;
      lastEmitted.current = normalizeHtml(value);
      return;
    }

    const next = normalizeHtml(value);
    if (next === lastEmitted.current) return;
    if (next === normalizeHtml(el.innerHTML)) {
      lastEmitted.current = next;
      return;
    }

    el.innerHTML = next || "";
    lastEmitted.current = next;
    setSelectedFigure(null);
  }, [value]);

  function emit() {
    const el = ref.current;
    if (!el) return;
    const html = serializeEditorHtml(el);
    lastEmitted.current = html;
    skipSync.current = true;
    onChange(html);
  }

  function focusEditor() {
    const el = ref.current;
    if (!el) return null;
    el.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount === 0) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    return el;
  }

  function insertHtml(html) {
    const el = focusEditor();
    if (!el) return;
    let ok = false;
    try {
      ok = document.execCommand("insertHTML", false, html + "<p><br></p>");
    } catch {
      ok = false;
    }
    if (!ok) {
      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      while (wrap.firstChild) el.appendChild(wrap.firstChild);
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      el.appendChild(p);
    }
    emit();
  }

  function runCommand(cmd, arg) {
    focusEditor();
    try {
      document.execCommand(cmd, false, arg);
    } catch {
      /* ignore */
    }
    emit();
  }

  function applyBlock(tag) {
    focusEditor();
    const wrapped = `<${tag}>`;
    let ok = false;
    try {
      ok = document.execCommand("formatBlock", false, wrapped);
      if (!ok) ok = document.execCommand("formatBlock", false, tag);
    } catch {
      ok = false;
    }

    if (!ok) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        const block = document.createElement(tag);
        try {
          range.surroundContents(block);
        } catch {
          block.appendChild(range.extractContents());
          range.insertNode(block);
        }
        sel.removeAllRanges();
        const after = document.createRange();
        after.selectNodeContents(block);
        after.collapse(false);
        sel.addRange(after);
      }
    }
    emit();
  }

  function addLink() {
    focusEditor();
    const url = window.prompt("Link URL (https://…)");
    if (!url) return;
    runCommand("createLink", url.trim());
  }

  function addYoutube() {
    focusEditor();
    const raw = window.prompt("Paste YouTube link or video ID");
    if (!raw) return;
    const id = extractYoutubeId(raw);
    if (!id || !/^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
      window.alert("Could not read a YouTube video from that link.");
      return;
    }
    insertHtml(youtubeFigureHtml(id));
  }

  async function onInfographicFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImage(file, { maxWidth: 1600, quality: 82, kind: "hero" });
      const url = data?.url;
      if (!url) throw new Error("Upload failed");
      insertHtml(infographicFigureHtml(url, 100));
    } catch (err) {
      window.alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function clearFigureSelection() {
    const el = ref.current;
    el?.querySelectorAll(".article-infographic.rt-selected").forEach((n) => {
      n.classList.remove("rt-selected");
      n.querySelector(".rt-resize-handle")?.remove();
    });
    setSelectedFigure(null);
  }

  function selectInfographic(figure) {
    clearFigureSelection();
    figure.classList.add("rt-selected");
    if (!figure.querySelector(".rt-resize-handle")) {
      const handle = document.createElement("span");
      handle.className = "rt-resize-handle";
      handle.title = "Drag to resize";
      handle.contentEditable = "false";
      figure.appendChild(handle);
    }
    const w = Number(figure.dataset.width) || parseInt(figure.style.width, 10) || 100;
    setSelectedWidth(w);
    setSelectedFigure(figure);
  }

  function setFigureWidth(figure, width) {
    const w = Math.min(100, Math.max(20, Math.round(width)));
    figure.dataset.width = String(w);
    figure.style.width = `${w}%`;
    setSelectedWidth(w);
    emit();
  }

  function onEditorClick(e) {
    const figure = e.target.closest?.(".article-infographic");
    if (figure && ref.current?.contains(figure)) {
      e.preventDefault();
      selectInfographic(figure);
      return;
    }
    if (!e.target.closest?.(".rt-resize-handle")) {
      clearFigureSelection();
    }
  }

  function onEditorMouseDown(e) {
    const handle = e.target.closest?.(".rt-resize-handle");
    if (!handle) return;
    const figure = handle.closest(".article-infographic");
    const surface = ref.current;
    if (!figure || !surface) return;
    e.preventDefault();
    e.stopPropagation();
    selectInfographic(figure);
    const startX = e.clientX;
    const startW = Number(figure.dataset.width) || parseInt(figure.style.width, 10) || 100;
    const parentW = figure.parentElement?.clientWidth || surface.clientWidth || 1;

    function onMove(ev) {
      const dx = ev.clientX - startX;
      const next = startW + (dx / parentW) * 100;
      const w = Math.min(100, Math.max(20, Math.round(next)));
      figure.dataset.width = String(w);
      figure.style.width = `${w}%`;
      setSelectedWidth(w);
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      emit();
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function onPaste(e) {
    const text = e.clipboardData?.getData("text/plain")?.trim() || "";
    if (!text) return;
    const id = extractYoutubeId(text);
    const looksLikeYoutube =
      /youtu\.be\//i.test(text) ||
      /youtube\.com\//i.test(text) ||
      (/^[a-zA-Z0-9_-]{11}$/.test(text) && text === id);

    if (id && /^[a-zA-Z0-9_-]{6,20}$/.test(id) && looksLikeYoutube) {
      e.preventDefault();
      insertHtml(youtubeFigureHtml(id));
    }
  }

  return (
    <div className="rich-editor span-2">
      <span className="rich-editor-label">
        {label}
        {required ? " *" : ""}
      </span>

      <div className="rich-toolbar" role="toolbar" aria-label="Formatting">
        <label className="rich-block-select" htmlFor={blockId}>
          <span className="sr-only">Heading & paragraph</span>
          <select
            id={blockId}
            defaultValue=""
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              const tag = e.target.value;
              e.target.value = "";
              if (tag) applyBlock(tag);
            }}
          >
            <option value="" disabled>
              Heading & paragraph
            </option>
            {BLOCKS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        {INLINE.map((action) => (
          <button
            key={action.cmd}
            type="button"
            className={`rich-btn ${action.cmd === "bold" ? "rich-btn-b" : ""} ${action.cmd === "italic" ? "rich-btn-i" : ""} ${action.cmd === "underline" ? "rich-btn-u" : ""}`}
            title={action.title}
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand(action.cmd);
            }}
          >
            {action.label}
          </button>
        ))}

        {LISTS.map((action) => (
          <button
            key={action.cmd}
            type="button"
            className="rich-btn"
            title={action.title}
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand(action.cmd);
            }}
          >
            {action.label}
          </button>
        ))}

        <button
          type="button"
          className="rich-btn"
          title="Add link"
          onMouseDown={(e) => {
            e.preventDefault();
            addLink();
          }}
        >
          Link
        </button>

        <button
          type="button"
          className="rich-btn"
          title="Insert infographic / image"
          disabled={uploading}
          onMouseDown={(e) => {
            e.preventDefault();
            fileRef.current?.click();
          }}
        >
          {uploading ? "Uploading…" : "Infographic"}
        </button>

        <button
          type="button"
          className="rich-btn"
          title="Insert YouTube video"
          onMouseDown={(e) => {
            e.preventDefault();
            addYoutube();
          }}
        >
          YouTube
        </button>

        <button
          type="button"
          className="rich-btn"
          title="Clear formatting"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand("removeFormat");
            applyBlock("p");
          }}
        >
          Clear
        </button>

        {selectedFigure ? (
          <span className="rich-width-group" title="Infographic width">
            <span className="rich-width-label">Size</span>
            {WIDTH_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`rich-btn ${selectedWidth === p.value ? "rich-btn-active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setFigureWidth(selectedFigure, p.value);
                }}
              >
                {p.label}
              </button>
            ))}
            <label className="rich-width-slider">
              <span className="sr-only">Width percent</span>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={selectedWidth}
                onChange={(e) => setFigureWidth(selectedFigure, Number(e.target.value))}
              />
              <em>{selectedWidth}%</em>
            </label>
          </span>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onInfographicFile}
      />

      <div
        ref={ref}
        className="rich-surface"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        data-placeholder="Write content here… Paste a YouTube link for video, or use Infographic to add an image."
        onInput={emit}
        onBlur={emit}
        onPaste={onPaste}
        onClick={onEditorClick}
        onMouseDown={onEditorMouseDown}
        suppressContentEditableWarning
      />

      <p className="field-hint muted" style={{ margin: 0 }}>
        Tip: click an infographic, then use Size / drag the corner handle to resize. Paste a YouTube URL to embed a 16:9 video.
      </p>

      {required && !String(value || "").replace(/<[^>]+>/g, "").trim() ? (
        <input tabIndex={-1} className="sr-only" required value="" onChange={() => {}} />
      ) : null}
    </div>
  );
}
