// src/api/sales.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api/v1";

function toQs(obj = {}) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      if (v.length === 0) return;
      params.set(k, v.join(","));
    } else {
      const s = String(v).trim();
      if (s === "") return;
      params.set(k, s);
    }
  });
  return params.toString();
}

export async function fetchSales(params = {}) {
  if (!params.include) params.include = "customer,product,salesperson";
  const qs = toQs(params);
  const url = `${API_BASE}/sales${qs ? "?" + qs : ""}`;
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Failed to fetch sales: ${res.status} ${txt}`);
  }
  return res.json();
}
