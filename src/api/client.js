const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

/** Resolve CMS/upload paths so images load from the API host. */
export function mediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function youtubeThumbUrl(id, quality = "hqdefault") {
  if (!id) return "";
  // hqdefault is reliable; maxresdefault often returns a gray stub with HTTP 200
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}

/** Prefer hq720 → sd → hq → mq (skip maxres — gray stub often returns 200). */
export function youtubeThumbCandidates(id) {
  if (!id) return [];
  return ["hq720", "sddefault", "hqdefault", "mqdefault"].map(
    (q) => `https://i.ytimg.com/vi/${id}/${q}.jpg`
  );
}

export async function fetchPublic(path, params = {}) {
  const url = new URL(`${API_URL}/api/public${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText || "Request failed");
  }
  return res.json();
}

export async function submitLead(body) {
  const res = await fetch(`${API_URL}/api/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || res.statusText || "Request failed");
  return data;
}

export async function postAiCounsellor(messages) {
  const res = await fetch(`${API_URL}/api/public/ai-counsellor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || res.statusText || "AI counsellor unavailable");
  return data;
}

/** Alias used by branch/apply forms */
export const postLead = submitLead;
