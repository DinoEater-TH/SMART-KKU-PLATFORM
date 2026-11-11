// src/lib/api.ts
const USER_KEY = "skku_user_id";

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
}

export function setUserId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(USER_KEY, id);
  else localStorage.removeItem(USER_KEY);
}

export async function api(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  const uid = getUserId();
  if (uid) headers.set("x-user-id", uid);
  if (!headers.has("Content-Type") && opts.body) headers.set("Content-Type", "application/json");
  const res = await fetch(path, { ...opts, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}
