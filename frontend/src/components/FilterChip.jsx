import React from "react";
export default function FilterChip({ label, active, onClick }) {
  return (
    <button className={`chip ${active ? "active" : ""}`} onClick={onClick} type="button" aria-pressed={!!active}>
      {label}
    </button>
  );
}
