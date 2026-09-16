import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
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
  if (!root) return "";
  const clone = root.cloneNode(true);
  clone.querySelectorAll(".rt-img-controls, .rt-resize-handle").forEach((n) => n.remove());
  clone.querySelectorAll(".rt-selected").forEach((n) => n.classList.remove("rt-selected"));
  clone.querySelectorAll("p").forEach((p) => {
    const text = (p.textContent || "").replace(/\u00a0/g, " ").trim();
    const html = (p.innerHTML || "").replace(/&nbsp;/gi, "").replace(/<br\s*\/?>/gi, "").trim();
    if (!text && !html) p.remove();
  });
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
 * WordPress-style Visual + Text (HTML) editor.
 * Both panes stay mounted so content is never lost when switching tabs.
 */
export default function RichTextEditor({ label, value = "", onChange, required = false }) {
  const visualRef = useRef(null);
  const fileRef = useRef(null);
  const lastSent = useRef(normalizeHtml(value));
  const applyingExternal = useRef(false);
  const blockId = useId();
  const [mode, setMode] = useState("visual");
  const [textDraft, setTextDraft] = useState(() => String(value || ""));
  const [uploading, setUploading] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [selectedWidth, setSelectedWidth] = useState(100);

  // Sync from parent value (article load). Never rewrite DOM for our own keystrokes.
  useLayoutEffect(() => {
    const next = normalizeHtml(value);
    const raw = String(value || "");
    const el = visualRef.current;

    if (lastSent.current === next) {
      // Own emit — only seed empty Visual pane after mount
      if (el && next && !normalizeHtml(el.innerHTML)) {
        applyingExternal.current = true;
        el.innerHTML = next;
        applyingExternal.current = false;
      }
      return;
    }

    if (el) {
      applyingExternal.current = true;
      el.innerHTML = next || "";
      applyingExternal.current = false;
    }
    setTextDraft(raw);
    lastSent.current = next;
  }, [value]);

  useEffect(() => {
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      /* ignore */
    }
  }, []);

  function pushChange(html) {
    const next = normalizeHtml(html);
    lastSent.current = next;
    onChange(next);
  }

  function readVisualHtml() {
    return serializeEditorHtml(visualRef.current);
  }

  function emitFromVisual() {
    if (applyingExternal.current) return;
    const html = readVisualHtml();
    setTextDraft(html);
    pushChange(html);
  }

  function emitFromText(raw) {
    setTextDraft(raw);
    pushChange(raw);
    if (visualRef.current) {
      applyingExternal.current = true;
      visualRef.current.innerHTML = normalizeHtml(raw) || "";
      applyingExternal.current = false;
    }
  }

  function switchMode(nextMode) {
    if (nextMode === mode) return;
    if (nextMode === "text") {
      const html = readVisualHtml();
      setTextDraft(html);
      pushChange(html);
      clearFigureSelection();
      setMode("text");
      return;
    }
    // text → visual
    const html = normalizeHtml(textDraft);
    if (visualRef.current) {
      applyingExternal.current = true;
      visualRef.current.innerHTML = html || "";
      applyingExternal.current = false;
    }
    pushChange(html);
    setMode("visual");
  }

  function focusEditor() {
    const el = visualRef.current;
    if (!el || mode !== "visual") return null;
    el.focus();
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
    emitFromVisual();
  }

  function runCommand(cmd, arg) {
    focusEditor();
    try {
      document.execCommand(cmd, false, arg);
    } catch {
      /* ignore */
    }
    emitFromVisual();
  }

  function applyBlock(tag) {
    focusEditor();
    try {
      let ok = document.execCommand("formatBlock", false, `<${tag}>`);
      if (!ok) document.execCommand("formatBlock", false, tag);
    } catch {
      /* ignore */
    }
    emitFromVisual();
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
    if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) {
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
    visualRef.current?.querySelectorAll(".article-infographic.rt-selected").forEach((n) => {
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
    emitFromVisual();
  }

  function onEditorClick(e) {
    const figure = e.target.closest?.(".article-infographic");
    if (figure && visualRef.current?.contains(figure)) {
      e.preventDefault();
      selectInfographic(figure);
      return;
    }
    if (!e.target.closest?.(".rt-resize-handle")) clearFigureSelection();
  }

  function onEditorMouseDown(e) {
    const handle = e.target.closest?.(".rt-resize-handle");
    if (!handle) return;
    const figure = handle.closest(".article-infographic");
    const surface = visualRef.current;
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
      emitFromVisual();
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

    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id) && looksLikeYoutube) {
      e.preventDefault();
      insertHtml(youtubeFigureHtml(id));
    }
  }

  const hasText = Boolean(String(value || "").replace(/<[^>]+>/g, "").trim());

  return (
    <div className="rich-editor rich-editor--wp span-2">
      <div className="rich-editor-head">
        <span className="rich-editor-label">
          {label}
          {required ? " *" : ""}
        </span>
        <div className="rich-editor-tabs" role="tablist" aria-label="Editor mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "visual"}
            className={`rich-tab${mode === "visual" ? " is-active" : ""}`}
            onClick={() => switchMode("visual")}
          >
            Visual
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "text"}
            className={`rich-tab${mode === "text" ? " is-active" : ""}`}
            onClick={() => switchMode("text")}
          >
            Text
          </button>
        </div>
      </div>

      <div className="rich-editor-panel">
        {mode === "visual" ? (
          <div className="rich-toolbar" role="toolbar" aria-label="Formatting">
            <div className="rich-tool-group">
              <label className="rich-block-select" htmlFor={blockId}>
                <span className="sr-only">Paragraph / Heading</span>
                <select
                  id={blockId}
                  defaultValue="p"
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    if (e.target.value) applyBlock(e.target.value);
                  }}
                >
                  {BLOCKS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <span className="rich-sep" aria-hidden="true" />

            <div className="rich-tool-group">
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
            </div>

            <span className="rich-sep" aria-hidden="true" />

            <div className="rich-tool-group">
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
            </div>

            <span className="rich-sep" aria-hidden="true" />

            <div className="rich-tool-group">
              <button
                type="button"
                className="rich-btn"
                title="Insert / edit link"
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
                title="Add Media — insert image / infographic"
                disabled={uploading}
                onMouseDown={(e) => {
                  e.preventDefault();
                  fileRef.current?.click();
                }}
              >
                {uploading ? "Uploading…" : "Add Media"}
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
            </div>

            <span className="rich-sep" aria-hidden="true" />

            <div className="rich-tool-group">
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
            </div>

            {selectedFigure ? (
              <>
                <span className="rich-sep" aria-hidden="true" />
                <span className="rich-width-group" title="Image width">
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
              </>
            ) : null}
          </div>
        ) : (
          <div className="rich-text-mode-bar">
            HTML source — edit tags here, then switch to Visual to preview formatting.
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onInfographicFile}
        />

        {/* Keep both panes mounted so switching tabs never drops content */}
        <div
          ref={visualRef}
          className="rich-surface"
          contentEditable={mode === "visual"}
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          data-placeholder="Start writing… Paste a YouTube link to embed video, or use Add Media for images."
          hidden={mode !== "visual"}
          onInput={emitFromVisual}
          onBlur={emitFromVisual}
          onPaste={onPaste}
          onClick={onEditorClick}
          onMouseDown={onEditorMouseDown}
          suppressContentEditableWarning
        />

        <textarea
          className="rich-surface rich-surface--text"
          value={textDraft}
          onChange={(e) => emitFromText(e.target.value)}
          spellCheck={false}
          aria-label={`${label} HTML`}
          placeholder="Paste or edit HTML here…"
          hidden={mode !== "text"}
        />
      </div>

      <p className="rich-editor-foot field-hint muted">
        {mode === "visual"
          ? "Tip: click an image, then use Size or drag the corner to resize. Paste a YouTube URL for a 16:9 embed."
          : "Text mode shows raw HTML. Switch to Visual for formatting tools, media, and YouTube embeds."}
      </p>

      {required && !hasText ? (
        <input tabIndex={-1} className="sr-only" required value="" onChange={() => {}} />
      ) : null}
    </div>
  );
}
