export default function Pagination({ page, totalPages, onPage }) {
  return (
    <div className="pagination">
      <button onClick={() => onPage(1)} disabled={page <= 1}>First</button>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}>Prev</button>

      <span>
        {page} / {totalPages}
      </span>

      <button onClick={() => onPage(page + 1)} disabled={page >= totalPages}>Next</button>
      <button onClick={() => onPage(totalPages)} disabled={page >= totalPages}>Last</button>
    </div>
  );
}
