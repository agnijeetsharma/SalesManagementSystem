// src/components/Filters.jsx
import React from "react";

/*
Props:
- params: current params object
- setParams: function to update params (accepts patch or function)
- facets: { regions:[], categories:[], payments:[], tags:[] } (optional)
*/

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      className={`filter-chip ${active ? "filter-chip-active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function Filters({ params, setParams, facets = {} }) {
  const toggle = (key, val) => {
    const curr = Array.isArray(params[key]) ? [...params[key]] : [];
    const idx = curr.indexOf(val);
    if (idx >= 0) curr.splice(idx, 1); else curr.push(val);
    setParams(prev => ({ ...prev, [key]: curr, page: 1 }));
  };

  const clearAll = () => setParams(prev => ({ ...prev, q: "", customerRegions: [], productCategories: [], paymentMethods: [], tags: [], page: 1 }));

  return (
    <div className="filters">
      <div className="filters-header">
        <strong>Filters</strong>
        <button className="link-btn" onClick={clearAll}>Clear</button>
      </div>

      {facets.regions && facets.regions.length > 0 && (
        <div className="facet">
          <div className="facet-title">Regions</div>
          <div className="facet-list">
            {facets.regions.map(r => (
              <ToggleButton key={r} active={params.customerRegions.includes(r)} onClick={() => toggle("customerRegions", r)}>{r}</ToggleButton>
            ))}
          </div>
        </div>
      )}

      {facets.categories && facets.categories.length > 0 && (
        <div className="facet">
          <div className="facet-title">Categories</div>
          <div className="facet-list">
            {facets.categories.map(c => (
              <ToggleButton key={c} active={params.productCategories.includes(c)} onClick={() => toggle("productCategories", c)}>{c}</ToggleButton>
            ))}
          </div>
        </div>
      )}

      {facets.payments && facets.payments.length > 0 && (
        <div className="facet">
          <div className="facet-title">Payment</div>
          <div className="facet-list">
            {facets.payments.map(p => (
              <ToggleButton key={p} active={params.paymentMethods.includes(p)} onClick={() => toggle("paymentMethods", p)}>{p}</ToggleButton>
            ))}
          </div>
        </div>
      )}

      {facets.tags && facets.tags.length > 0 && (
        <div className="facet">
          <div className="facet-title">Tags</div>
          <div className="facet-list">
            {facets.tags.map(t => (
              <ToggleButton key={t} active={params.tags.includes(t)} onClick={() => toggle("tags", t)}>{t}</ToggleButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
