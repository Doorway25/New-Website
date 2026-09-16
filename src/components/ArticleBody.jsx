import { useMemo, useState } from "react";
import { mediaUrl } from "../api/client";

const YT_URL_RE =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,20})(?:[^\s<]*)?/i;

function extractYoutubeId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[a-zA-Z0-9_-]{6,20}$/.test(raw)) return raw;
  const m = raw.match(YT_URL_RE);
  if (m?.[1]) return m[1];
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const embed = url.pathname.match(/\/embed\/([^/?]+)/);
    if (embed?.[1]) return embed[1];
    const shorts = url.pathname.match(/\/shorts\/([^/?]+)/);
    if (shorts?.[1]) return shorts[1];
  } catch {
    /* ignore */
  }
  return "";
}

function youtubeThumb(id) {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

function buildYoutubeFigure(doc, id) {
  const figure = doc.createElement("figure");
  figure.className = "article-youtube";
  figure.setAttribute("data-youtube-id", id);

  const frame = doc.createElement("div");
  frame.className = "article-youtube-frame";

  const img = doc.createElement("img");
  img.className = "article-youtube-thumb";
  img.src = youtubeThumb(id);
  img.alt = "YouTube video";
  img.loading = "lazy";

  const play = doc.createElement("span");
  play.className = "article-youtube-play";
  play.setAttribute("aria-hidden", "true");

  frame.appendChild(img);
  frame.appendChild(play);
  figure.appendChild(frame);
  return figure;
}

/** Rewrite upload paths + turn bare YouTube links into 16:9 embeds */
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

  root.querySelectorAll("figure.article-youtube").forEach((fig) => {
    const id = fig.getAttribute("data-youtube-id") || extractYoutubeId(fig.textContent);
    if (!id) return;
    fig.setAttribute("data-youtube-id", id);
    if (!fig.querySelector(".article-youtube-frame")) {
      fig.replaceWith(buildYoutubeFigure(doc, id));
    }
  });

  // Convert paragraphs that are only a YouTube URL into embeds
  root.querySelectorAll("p, li, div").forEach((node) => {
    if (node.querySelector("figure, iframe, .article-youtube")) return;
    const text = (node.textContent || "").trim();
    if (!text || text.length > 200) return;
    const id = extractYoutubeId(text);
    if (!id) return;
    if (!YT_URL_RE.test(text) && text !== id) return;
    // Only replace if the node is essentially just the link
    const stripped = text.replace(YT_URL_RE, "").trim();
    if (stripped && text !== id) return;
    node.replaceWith(buildYoutubeFigure(doc, id));
  });

  // Convert naked anchor tags that are youtube-only
  root.querySelectorAll("a[href]").forEach((a) => {
    const id = extractYoutubeId(a.getAttribute("href") || "");
    if (!id) return;
    const parent = a.parentElement;
    if (!parent) return;
    const onlyLink =
      parent.childNodes.length === 1 ||
      (parent.textContent || "").trim() === (a.textContent || "").trim();
    if (!onlyLink) return;
    if (parent.matches("figcaption")) return;
    parent.replaceWith(buildYoutubeFigure(doc, id));
  });

  return root.innerHTML;
}

function YoutubeEmbed({ id }) {
  const [playing, setPlaying] = useState(false);
  if (!id) return null;

  if (playing) {
    return (
      <figure className="article-youtube">
        <div className="article-youtube-frame">
          <iframe
            title="YouTube video"
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </figure>
    );
  }

  return (
    <figure className="article-youtube">
      <button type="button" className="article-youtube-frame article-youtube-btn" onClick={() => setPlaying(true)}>
        <img
          className="article-youtube-thumb"
          src={youtubeThumb(id)}
          alt="Play YouTube video"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          }}
        />
        <span className="article-youtube-play" aria-hidden="true" />
      </button>
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
        out.push({ type: "youtube", id });
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
    <div className="article-body space-y-4 text-[15px] leading-relaxed text-slate-600">
      {blocks.map((block, i) => {
        const text = String(block || "");
        if (!text.trim()) return null;
        if (/<[a-z][\s\S]*>/i.test(text)) {
          return <ArticleHtmlBlock key={i} html={text} />;
        }
        // Plain paragraph that might be a YouTube URL
        const id = extractYoutubeId(text);
        if (id && (YT_URL_RE.test(text) || text === id) && text.replace(YT_URL_RE, "").trim() === "") {
          return <YoutubeEmbed key={i} id={id} />;
        }
        return <p key={i}>{text}</p>;
      })}
    </div>
  );
}
