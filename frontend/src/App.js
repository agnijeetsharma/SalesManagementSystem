// src/App.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import Table from "./components/Table";
import Pagination from "./components/Pagination";
import SummaryCards from "./components/SummaryCards";
import { fetchSales } from "./api/sales";
import "./index.css";

export default function App() {
  const [params, setParams] = useState({
    q: "",
    customerRegions: [],
    productCategories: [],
    paymentMethods: [],
    tags: [],
    page: 1,
    pageSize: 10,
    sortBy: "customerName",
    sortDir: "asc",
    include: "customer,product,salesperson"
  });

  const [data, setData] = useState({ items: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // stable updater so child components get same ref
  const updateParams = useCallback((patch) => {
    setParams(prev => (typeof patch === "function" ? { ...prev, ...patch(prev) } : { ...prev, ...patch }));
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchSales(params);
        if (!mounted) return;
        setData(res || { items: [], total: 0, totalPages: 0 });
      } catch (err) {
        console.error("fetchSales error:", err);
        if (!mounted) return;
        setError(err.message || "Failed to fetch sales");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [params]);

  const facets = useMemo(() => {
    const regions = new Set(), categories = new Set(), payments = new Set(), tags = new Set();
    for (const it of data.items || []) {
      if (it.customerRegionSnapshot) regions.add(it.customerRegionSnapshot);
      if (it.productCategorySnapshot) categories.add(it.productCategorySnapshot);
      if (it.paymentMethod) payments.add(it.paymentMethod);
      if (Array.isArray(it.tags)) it.tags.forEach(t => t && tags.add(t));
      if (it.raw) {
        if (it.raw["Customer region"]) regions.add(it.raw["Customer region"]);
        if (it.raw["Product Category"]) categories.add(it.raw["Product Category"]);
        if (it.raw["Payment Method"]) payments.add(it.raw["Payment Method"]);
        if (it.raw["Tags"]) String(it.raw["Tags"]).split("|").map(s => s.trim()).forEach(t => t && tags.add(t));
      }
    }
    return { regions: [...regions].sort(), categories: [...categories].sort(), payments: [...payments].sort(), tags: [...tags].sort() };
  }, [data.items]);

  const items = Array.isArray(data.items) ? data.items : [];
  const summary = {
    totalAmount: items.reduce((s, it) => s + (Number(it.finalAmount) || 0), 0),
    totalOrders: data.total || 0,
    totalQuantity: items.reduce((s, it) => s + (Number(it.quantity) || 0), 0)
  };

  return (
    <div className="app">
      <div className="header"><h1>Sales Dashboard</h1></div>
      <div className="flex">
        <Sidebar />
        <div className="main">
          <div className="panel">
            <div className="top-controls">
              <div style={{flex:1}}><SearchBar value={params.q} onSearch={(q) => updateParams({ q, page: 1 })} /></div>
              <div className="controls-right">
                <select className="select" value={params.sortBy} onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}>
                  <option value="customerName">Customer name (A-Z)</option>
                  <option value="date">Date</option>
                </select>
                <select className="select" value={params.pageSize} onChange={(e) => updateParams({ pageSize: Number(e.target.value), page: 1 })}>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>

            <Filters params={params} setParams={updateParams} facets={facets} />
            <SummaryCards summary={summary} />
          </div>

          <div className="table-wrap panel" style={{marginTop:12}}>
            {loading ? <div className="no-results">Loading...</div> : error ? <div className="no-results">{error}</div> : (
              <>
                <Table items={items} />
                <div className="pagination"><Pagination page={params.page} totalPages={data.totalPages || 1} onPage={(p) => updateParams({ page: p })} /></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
