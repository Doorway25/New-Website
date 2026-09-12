/** YouTube ID + metadata helpers for story CMS */

export function extractYoutubeId(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{6,20}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const embed = url.pathname.match(/\/embed\/([^/?]+)/);
    if (embed?.[1]) return embed[1];
    const shorts = url.pathname.match(/\/shorts\/([^/?]+)/);
    if (shorts?.[1]) return shorts[1];
  } catch {
    // not a URL
  }
  return null;
}

function decodeJsonString(value) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

function splitDescription(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
}

async function fetchOEmbed(id) {
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
  const res = await fetch(endpoint);
  if (!res.ok) return null;
  return res.json();
}

async function fetchApiSnippet(id) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", id);
  url.searchParams.set("key", key);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const snippet = data?.items?.[0]?.snippet;
  if (!snippet) return null;
  return {
    title: snippet.title || "",
    description: snippet.description || "",
    thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || "",
  };
}

async function scrapeWatchPage(id) {
  const res = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; EducationDoorwayBot/1.0)",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const titleMatch =
    html.match(/"title":\{"runs":\[\{"text":"(.*?)"\}\]\}/) ||
    html.match(/"videoDetails":\{"videoId":"[^"]+","title":"(.*?)"/);
  const descMatch = html.match(/"shortDescription":"(.*?)"/);
  const title = titleMatch?.[1] ? decodeJsonString(titleMatch[1]) : "";
  const description = descMatch?.[1] ? decodeJsonString(descMatch[1]) : "";
  if (!title && !description) return null;
  return { title, description };
}

export async function fetchYoutubeMeta(raw) {
  const id = extractYoutubeId(raw);
  if (!id) {
    const err = new Error("Invalid YouTube URL or ID");
    err.status = 400;
    throw err;
  }

  let title = "";
  let description = "";
  let thumbnail = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  let author = "";

  const api = await fetchApiSnippet(id).catch(() => null);
  if (api) {
    title = api.title || title;
    description = api.description || description;
    thumbnail = api.thumbnail || thumbnail;
  }

  if (!title) {
    const oembed = await fetchOEmbed(id).catch(() => null);
    if (oembed) {
      title = oembed.title || title;
      author = oembed.author_name || author;
      thumbnail = oembed.thumbnail_url || thumbnail;
    }
  }

  if (!description || !title) {
    const scraped = await scrapeWatchPage(id).catch(() => null);
    if (scraped) {
      title = title || scraped.title || "";
      description = description || scraped.description || "";
    }
  }

  if (!title && !description) {
    const err = new Error("Could not fetch YouTube details for this video");
    err.status = 404;
    throw err;
  }

  const paragraphs = splitDescription(description);
  return {
    id,
    title: title.trim(),
    description: description.trim(),
    paragraphs,
    quote: title.trim(),
    text: paragraphs.join("\n"),
    thumbnail,
    author,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}
