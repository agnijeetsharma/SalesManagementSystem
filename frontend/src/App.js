import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import Table from "./components/Table";
import Pagination from "./components/Pagination";
import SummaryCards from "./components/SummaryCards";
import { fetchSales } from "./api/sales";

export default function App() {
  const [params, setParams] = useState({
    q: "",
    customerRegions: [],
    productCategories: [],
    paymentMethods: [],
    tags: [],
    page: 1,
    pageSize: 10,
    sortBy: "date",
    sortDir: "desc",
    include: "customer,product,salesperson",
  });

  const [data, setData] = useState({ items: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const callParams = {
          ...params,
          include: params.include || "customer,product,salesperson",
        };
        const res = await fetchSales(callParams);
        if (!mounted) return;
        setData(res || { items: [], total: 0, totalPages: 0 });
      } catch (err) {
        console.error("Failed to fetch sales", err);
        if (!mounted) return;
        setError(err.message || "Failed to fetch sales");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [params]);

  const items = Array.isArray(data.items) ? data.items : [];
  const summary = {
    totalAmount: items.reduce((s, it) => s + (Number(it.finalAmount) || 0), 0),
    totalOrders: data.total || 0,
    totalQuantity: items.reduce((s, it) => s + (Number(it.quantity) || 0), 0),
  };

  const updateParams = (patch) => {
    setParams((prev) => {
      if (typeof patch === "function") return { ...prev, ...patch(prev) };
      return { ...prev, ...patch };
    });
  };

  return (
    <div className="container">
      <h1 className="title">Sales Dashboard</h1>

      <SearchBar
        value={params.q}
        onSearch={(q) => updateParams({ q, page: 1 })}
      />

      <Filters params={params} setParams={updateParams} />

      <SummaryCards summary={summary} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <Table items={items} />

          <Pagination
            page={params.page}
            totalPages={data.totalPages || 0}
            onPage={(p) => updateParams({ page: p })}
          />
        </>
      )}
    </div>
  );
}
