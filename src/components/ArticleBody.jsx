import { useMemo, useState } from "react";
import { mediaUrl } from "../api/client";

const YT_URL_RE =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[^\s<"']*)?/i;

function isYoutubeVideoId(id) {
  // Real YouTube video IDs are always exactly 11 chars.
  return /^[a-zA-Z0-9_-]{11}$/.test(String(id || ""));
}

function extractYoutubeId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const m = raw.match(YT_URL_RE);
  if (m?.[1] && isYoutubeVideoId(m[1])) return m[1];
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] || "";
      return isYoutubeVideoId(id) ? id : "";
    }
    if (host.includes("youtube")) {
      const v = url.searchParams.get("v");
      if (isYoutubeVideoId(v)) return v;
      const embed = url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);
      if (embed?.[1] && isYoutubeVideoId(embed[1])) return embed[1];
    }
  } catch {
    /* ignore */
  }
  // Bare ID only when the whole string is exactly 11 chars (never list words like "Location")
  if (isYoutubeVideoId(raw)) return raw;
  return "";
}

function youtubeThumbCandidates(id) {
  return [
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
  ];
}

function buildYoutubeFigure(doc, id) {
  const figure = doc.createElement("figure");
  figure.className = "article-youtube";
  figure.setAttribute("data-youtube-id", id);
  const frame = doc.createElement("div");
  frame.className = "article-youtube-frame";
  frame.setAttribute("data-youtube-id", id);
  figure.appendChild(frame);
  return figure;
}

function cleanEmptyParagraphs(root) {
  root.querySelectorAll("p").forEach((p) => {
    const html = (p.innerHTML || "")
      .replace(/&nbsp;/gi, " ")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/\s+/g, "")
      .trim();
    const text = (p.textContent || "").replace(/\u00a0/g, " ").trim();
    if (!text && !html) p.remove();
  });
}

/** Rewrite upload paths + turn YouTube links/iframes into embeds */
function prepareArticleHtml(html) {
  if (!html || typeof document === "undefined") return html || "";
  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return html;

  root.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (src) img.setAttribute("src", mediaUrl(src));
  });

  root.querySelectorAll("figure.article-infographic").forEach((fig) => {
    const w = fig.getAttribute("data-width") || parseInt(fig.style.width, 10);
    if (w && !fig.style.width) fig.style.width = `${w}%`;
  });

  // Existing YouTube iframes → figure embeds
  root.querySelectorAll("iframe").forEach((iframe) => {
    const id = extractYoutubeId(iframe.getAttribute("src") || "");
    if (!id) return;
    iframe.replaceWith(buildYoutubeFigure(doc, id));
  });

  root.querySelectorAll("figure.article-youtube").forEach((fig) => {
    const id =
      fig.getAttribute("data-youtube-id") ||
      extractYoutubeId(fig.querySelector("a")?.getAttribute("href") || "") ||
      extractYoutubeId(fig.querySelector("iframe")?.getAttribute("src") || "");
    if (!isYoutubeVideoId(id)) {
      // Invalid/false-positive embeds (e.g. list words mistaken for IDs) → remove
      fig.remove();
      return;
    }
    fig.replaceWith(buildYoutubeFigure(doc, id));
  });

  // Paragraphs / divs that are only a YouTube URL (never list items / plain words)
  root.querySelectorAll("p, div").forEach((node) => {
    if (node.closest("figure, li, ul, ol, .article-youtube")) return;
    if (node.querySelector("figure, iframe, .article-youtube, img, ul, ol")) return;
    const text = (node.textContent || "").trim();
    if (!text || text.length > 220) return;
    if (!YT_URL_RE.test(text)) return;
    const id = extractYoutubeId(text);
    if (!isYoutubeVideoId(id)) return;
    const stripped = text.replace(YT_URL_RE, "").trim();
    if (stripped) return;
    node.replaceWith(buildYoutubeFigure(doc, id));
  });

  // Anchors that are youtube-only
  root.querySelectorAll("a[href]").forEach((a) => {
    const id = extractYoutubeId(a.getAttribute("href") || "");
    if (!isYoutubeVideoId(id)) return;
    const parent = a.parentElement;
    if (!parent || parent.matches("figcaption, li")) return;
    if (parent.closest("ul, ol, figure")) return;
    const onlyLink =
      parent.childNodes.length === 1 ||
      (parent.textContent || "").trim() === (a.textContent || "").trim();
    if (!onlyLink) return;
    parent.replaceWith(buildYoutubeFigure(doc, id));
  });

  convertShortParagraphRunsToLists(doc, root);
  cleanEmptyParagraphs(root);

  return root.innerHTML;
}

function looksLikeListItem(text) {
  const t = String(text || "").trim();
  if (!t || t.length > 140) return false;
  if (t.includes("\n")) return false;
  if (/^[•\-\u2013\u2014*]\s+/.test(t)) return true;
  if (/^\d+[.)]\s+\S/.test(t)) return true;
  if (/\?$/.test(t)) return true;
  return false;
}

function stripListPrefix(text) {
  return String(text || "")
    .replace(/^[•\-\u2013\u2014*]\s+/, "")
    .trim();
}

function convertShortParagraphRunsToLists(doc, root) {
  const children = Array.from(root.childNodes);
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.nodeType !== 1 || node.tagName !== "P") {
      i += 1;
      continue;
    }
    const text = (node.textContent || "").trim();
    if (!looksLikeListItem(text)) {
      i += 1;
      continue;
    }

    const run = [node];
    let j = i + 1;
    while (j < children.length) {
      const next = children[j];
      if (next.nodeType !== 1 || next.tagName !== "P") break;
      const nextText = (next.textContent || "").trim();
      if (!looksLikeListItem(nextText)) break;
      run.push(next);
      j += 1;
    }

    if (run.length >= 2) {
      const ul = doc.createElement("ul");
      run.forEach((p) => {
        const li = doc.createElement("li");
        li.innerHTML = stripListPrefix(p.innerHTML);
        ul.appendChild(li);
      });
      run[0].replaceWith(ul);
      for (let k = 1; k < run.length; k += 1) run[k].remove();
      return convertShortParagraphRunsToLists(doc, root);
    }
    i = j;
  }
}

function YoutubeEmbed({ id }) {
  const [playing, setPlaying] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);
  if (!id) return null;

  const thumbs = youtubeThumbCandidates(id);
  const thumb = thumbs[Math.min(thumbIndex, thumbs.length - 1)];

  if (playing) {
    return (
      <figure className="article-youtube">
        <div className="article-youtube-frame">
          <iframe
            title="YouTube video"
            src={`https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </figure>
    );
  }

  return (
    <figure className="article-youtube">
      <button
        type="button"
        className="article-youtube-frame article-youtube-btn"
        onClick={() => setPlaying(true)}
        aria-label="Play YouTube video"
      >
        <img
          className="article-youtube-thumb"
          src={thumb}
          alt="Play YouTube video"
          loading="lazy"
          onError={() => {
            setThumbIndex((i) => (i + 1 < thumbs.length ? i + 1 : i));
          }}
        />
        <span className="article-youtube-play" aria-hidden="true" />
      </button>
      <a
        className="article-youtube-fallback"
        href={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch on YouTube
      </a>
    </figure>
  );
}

function ArticleHtmlBlock({ html }) {
  const prepared = useMemo(() => prepareArticleHtml(html), [html]);

  const parts = useMemo(() => {
    if (!prepared) return [];
    const doc = new DOMParser().parseFromString(`<div id="root">${prepared}</div>`, "text/html");
    const root = doc.getElementById("root");
    if (!root) return [{ type: "html", html: prepared }];

    const out = [];
    let buffer = "";

    const flush = () => {
      if (buffer.trim()) out.push({ type: "html", html: buffer });
      buffer = "";
    };

    Array.from(root.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.matches?.("figure.article-youtube")) {
        flush();
        const id = node.getAttribute("data-youtube-id") || "";
        if (isYoutubeVideoId(id)) out.push({ type: "youtube", id });
        return;
      }
      buffer += node.outerHTML || node.textContent || "";
    });
    flush();
    return out;
  }, [prepared]);

  return (
    <>
      {parts.map((part, i) =>
        part.type === "youtube" ? (
          <YoutubeEmbed key={`yt-${part.id}-${i}`} id={part.id} />
        ) : (
          <div key={`html-${i}`} className="article-html" dangerouslySetInnerHTML={{ __html: part.html }} />
        )
      )}
    </>
  );
}

export default function ArticleBody({ content }) {
  const blocks = Array.isArray(content) ? content : content ? [content] : [];

  return (
    <div className="article-body text-[15px] leading-relaxed text-slate-600">
      {blocks.map((block, i) => {
        const text = String(block || "");
        if (!text.trim()) return null;
        if (/<[a-z][\s\S]*>/i.test(text)) {
          return <ArticleHtmlBlock key={i} html={text} />;
        }
        const id = extractYoutubeId(text);
        if (id && YT_URL_RE.test(text) && text.replace(YT_URL_RE, "").trim() === "") {
          return <YoutubeEmbed key={i} id={id} />;
        }
        return <p key={i}>{text}</p>;
      })}
    </div>
  );
}
