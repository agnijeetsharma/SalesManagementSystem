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
    include: "customer,product,salesperson",
  });

  const [data, setData] = useState({
    items: [],
    total: 0,
    totalPages: 0,
    facets: { regions: [], categories: [], tags: [], payments: [] },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateParams = useCallback((patch) => {
    setParams((prev) =>
      typeof patch === "function"
        ? { ...prev, ...patch(prev) }
        : { ...prev, ...patch }
    );
  }, []);
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchSales(params);
        if (!mounted) return;

        setData(
          res || {
            items: [],
            total: 0,
            totalPages: 0,
            facets: { regions: [], categories: [], tags: [], payments: [] },
          }
        );
      } catch (err) {
        console.error("fetchSales error:", err);
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

  const facets = useMemo(() => {
    return (
      data.facets || {
        regions: [],
        categories: [],
        tags: [],
        payments: [],
      }
    );
  }, [data.facets]);

  const items = Array.isArray(data.items) ? data.items : [];

  const summary = {
    totalAmount: items.reduce((s, it) => s + (Number(it.finalAmount) || 0), 0),
    totalOrders: data.total || 0,
    totalQuantity: items.reduce((s, it) => s + (Number(it.quantity) || 0), 0),
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Sales Dashboard</h1>
      </div>

      <div className="flex">
        <Sidebar />

        <div className="main">
          <div className="panel">
            <div className="top-controls">
              <div style={{ flex: 1 }}>
                <SearchBar
                  value={params.q}
                  onSearch={(q) => updateParams({ q, page: 1 })}
                />
              </div>

              <div className="controls-right">
                <select
                  className="select"
                  value={params.sortBy}
                  onChange={(e) =>
                    updateParams({ sortBy: e.target.value, page: 1 })
                  }
                >
                  <option value="customerName">Customer name (A-Z)</option>
                  <option value="date">Date</option>
                </select>

                <select
                  className="select"
                  value={params.pageSize}
                  onChange={(e) =>
                    updateParams({
                      pageSize: Number(e.target.value),
                      page: 1,
                    })
                  }
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>
            <Filters
              params={params}
              updateParams={updateParams}
              facets={facets}
            />

            <SummaryCards summary={summary} />
          </div>

          <div className="table-wrap panel" style={{ marginTop: 12 }}>
            {loading ? (
              <div className="no-results">Loading...</div>
            ) : error ? (
              <div className="no-results">{error}</div>
            ) : (
              <>
                <Table items={items} />

                <div className="pagination">
                  <Pagination
                    page={params.page}
                    totalPages={data.totalPages || 1}
                    onPage={(p) => updateParams({ page: p })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
