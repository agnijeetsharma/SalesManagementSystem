import React from "react";
function Card({ label, value, currency }) {
  const display = currency ? new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(value || 0) : (value ?? 0);
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{display}</div>
    </div>
  );
}
export default function SummaryCards({ summary = {} }) {
  return (
    <div className="summary-row">
      <Card label="Total units sold" value={summary.totalQuantity || 0} />
      <Card label="Total Amount" value={summary.totalAmount || 0} currency />
      <Card label="Total Orders" value={summary.totalOrders || 0} />
    </div>
  );
}
