const BASE = import.meta.env.VITE_API_BASE_URL || "";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export async function apiGet(path, mockPath) {
  // 如果开 mock 且提供了 mockPath，就用本地 JSON；否则走真后端
  const url = USE_MOCK && mockPath ? mockPath : `${BASE}${path}`;
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`GET ${url} ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${url} ${res.status}`);
  return res.json();
}
