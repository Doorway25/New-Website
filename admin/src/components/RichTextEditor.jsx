import { useEffect, useId, useRef } from "react";

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

function normalizeHtml(html) {
  const s = String(html || "").trim();
  if (!s || s === "<br>" || s === "<div><br></div>") return "";
  return s;
}

/**
 * WYSIWYG editor that stores HTML.
 * Avoids resetting the DOM on every parent re-render (that was breaking formatting).
 */
export default function RichTextEditor({ label, value = "", onChange, required = false }) {
  const ref = useRef(null);
  const lastEmitted = useRef(normalizeHtml(value));
  const skipSync = useRef(false);
  const blockId = useId();

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
  }, [value]);

  function emit() {
    const el = ref.current;
    if (!el) return;
    const html = normalizeHtml(el.innerHTML);
    lastEmitted.current = html;
    skipSync.current = true;
    onChange(html);
  }

  function focusEditor() {
    const el = ref.current;
    if (!el) return null;
    el.focus();
    // Ensure there is a caret inside the editor
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

  function runCommand(cmd, arg) {
    focusEditor();
    let ok = false;
    try {
      ok = document.execCommand(cmd, false, arg);
    } catch {
      ok = false;
    }
    emit();
    return ok;
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

    // Fallback: wrap selected text / current block manually
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

      <div
        ref={ref}
        className="rich-surface"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        data-placeholder="Write content here… Select text, then choose a heading or style."
        onInput={emit}
        onBlur={emit}
        suppressContentEditableWarning
      />

      {required && !String(value || "").replace(/<[^>]+>/g, "").trim() ? (
        <input tabIndex={-1} className="sr-only" required value="" onChange={() => {}} />
      ) : null}
    </div>
  );
}
