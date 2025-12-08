
export default function parseCurrency(value) {
  if (value === undefined || value === null || value === '') return 0;
  try {
    const s = String(value);
    return Number(s.replace(/[^0-9.-]+/g, '')) || 0;
  } catch {
    return 0;
  }
}
