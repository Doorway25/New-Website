const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export { API_URL };
const TOKEN_KEY = "ed_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body !== undefined && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const get = (path) => api(path);
export const post = (path, body) => api(path, { method: "POST", body });
export const put = (path, body) => api(path, { method: "PUT", body });
export const del = (path) => api(path, { method: "DELETE" });

export async function uploadImage(file, { maxWidth = 960, quality = 64, replace, kind = "cover" } = {}) {
  const body = new FormData();
  body.append("file", file);
  const params = new URLSearchParams({
    maxWidth: String(maxWidth),
    quality: String(quality),
    kind: String(kind || "cover"),
  });
  if (replace) params.set("replace", replace);
  return api(`/api/admin/upload?${params}`, {
    method: "POST",
    body,
  });
}

export async function deleteUpload(url) {
  if (!url || !String(url).includes("/uploads/")) return { ok: true, deleted: false };
  return api("/api/admin/upload", { method: "DELETE", body: { url } });
}
