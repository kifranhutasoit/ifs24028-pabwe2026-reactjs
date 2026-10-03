const KEY = "access_token";
export const getAccessToken = () => localStorage.getItem(KEY);
export const putAccessToken = (t) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY));
export const assetUrl = (p) => (p ? `${new URL(DELCOM_BASEURL).origin}/${p}` : null);

export async function api(path, { method = "GET", body, query, form } = {}) {
  const clean = Object.entries(query || {}).filter(([, v]) => v !== "" && v != null);
  const qs = clean.length ? "?" + new URLSearchParams(clean) : "";
  const headers = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(DELCOM_BASEURL + path + qs, { method, headers, body: form || (body && JSON.stringify(body)) });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.message || "Terjadi kesalahan");
  return json.data;
}
