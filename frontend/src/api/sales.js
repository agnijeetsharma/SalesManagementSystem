

const API_BASE = process.env.VITE_API_BASE || "http://localhost:5000/api/v1";

export async function fetchSales(params) {
  const url = `${API_BASE}/sales?` + new URLSearchParams(params).toString();
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch sales");
  return res.json();
}
