export default function SummaryCards({ summary }) {
  return (
    <div className="summary-grid">
      <div className="card">
        <div className="label">Total Revenue</div>
        <div className="big">₹ {summary.totalAmount}</div>
        <div className="small">Across shown results</div>
      </div>

      <div className="card">
        <div className="label">Total Orders</div>
        <div className="big">{summary.totalOrders}</div>
        <div className="small">Matching orders</div>
      </div>

      <div className="card">
        <div className="label">Units Sold</div>
        <div className="big">{summary.totalQuantity}</div>
        <div className="small">Total units in filtered items</div>
      </div>
    </div>
  );
}
