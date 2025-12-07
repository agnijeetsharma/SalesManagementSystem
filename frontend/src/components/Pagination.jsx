import React from "react";
export default function Pagination({ page = 1, totalPages = 1, onPage }) {
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(totalPages, page + 1));
  return (
    <div>
      <button className="btn" onClick={prev} disabled={page<=1}>Prev</button>
      <span style={{padding:"8px 12px", display:"inline-block"}}>{page}</span>
      <button className="btn" onClick={next} disabled={page>=totalPages}>Next</button>
    </div>
  );
}
