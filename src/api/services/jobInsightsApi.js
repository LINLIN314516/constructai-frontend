const DEV = import.meta.env.DEV;
const BASE = DEV ? "/api" : (import.meta.env.VITE_API_BASE_URL || "");


function buildURL(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, String(v));
  });
  return usp.toString() ? `${BASE}/?${usp.toString()}` : `${BASE}/`;
}
export async function fetchInsights(params) {
  const url = buildURL(params);
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`GET ${url} ${res.status}`);
  return res.json();
}
