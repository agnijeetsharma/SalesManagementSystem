import React from "react";

const COLUMNS = [
  { key: "transactionId", label: "Transaction ID" },
  { key: "date", label: "Date" },
  { key: "customerId", label: "Customer ID" },
  { key: "customerName", label: "Customer name" },
  { key: "phone", label: "Phone Number" },
  { key: "gender", label: "Gender" },
  { key: "age", label: "Age" },
  { key: "productCategory", label: "Product Category" },
  { key: "quantity", label: "Quantity" },
  { key: "amount", label: "Total Amount" },
  { key: "customerRegion", label: "Customer region" },
  { key: "productId", label: "Product ID" },
  { key: "employeeName", label: "Employee name" },
];

function fmtAmount(v) {
  if (v == null || v === "") return "";
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Table({ items = [] }) {
  const get = (row, key) => {
    switch (key) {
      case "transactionId":
        return row.transactionId ?? row.raw?.["Transaction ID"] ?? "";
      case "date":
        return row.date
          ? new Date(row.date).toLocaleDateString()
          : row.raw?.Date ?? "";
      case "customerId":
        return row.customer?.customerId ?? row.raw?.["Customer ID"] ?? "";
      case "customerName":
        return (
          row.customer?.name ??
          row.customerNameSnapshot ??
          row.raw?.["Customer name"] ??
          ""
        );
      case "phone":
        return (
          row.customer?.phoneNumber ??
          row.phoneSnapshot ??
          row.raw?.["Phone Number"] ??
          ""
        );
      case "gender":
        return row.customer?.gender ?? row.raw?.Gender ?? "";
      case "age":
        return row.customer?.age ?? row.raw?.Age ?? "";
      case "productCategory":
        return (
          row.product?.category ??
          row.productCategorySnapshot ??
          row.raw?.["Product Category"] ??
          ""
        );
      case "quantity":
        return row.quantity ?? row.raw?.Quantity ?? "";
      case "amount":
        return fmtAmount(
          row.finalAmount ?? row.totalAmount ?? row.raw?.["Total Amount"]
        );
      case "customerRegion":
        return (
          row.customer?.region ??
          row.customerRegionSnapshot ??
          row.raw?.["Customer region"] ??
          ""
        );
      case "productId":
        return row.product?.productId ?? row.raw?.["Product ID"] ?? "";
      case "employeeName":
        return row.salesperson?.name ?? row.raw?.["Employee name"] ?? "";
      default:
        return "";
    }
  };

  if (!items || items.length === 0)
    return <div className="no-results">No results</div>;

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr key={row._id ?? idx}>
              {COLUMNS.map((col) => (
                <td key={col.key}>{get(row, col.key)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
