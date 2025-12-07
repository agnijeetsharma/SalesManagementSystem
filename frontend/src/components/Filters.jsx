// src/components/Filters.jsx
import React from "react";
import FilterDropdown from "./FilterDropDown";

/*
Usage:
  <Filters params={params} updateParams={updateParams} facets={facets} />
*/

export default function Filters({ params, updateParams, facets = {} }) {
  // helpers
  const setArray = (key, arr) => updateParams(prev => ({ ...prev, [key]: Array.isArray(arr) ? arr : [], page: 1 }));
  const getSafe = (key) => Array.isArray(params[key]) ? params[key] : [];

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <FilterDropdown
        label="Customer Region"
        items={facets.regions || []}
        selected={getSafe("customerRegions")}
        onChange={(arr) => setArray("customerRegions", arr)}
        multi
        placeholder="Region"
      />

      <FilterDropdown
        label="Gender"
        items={["Male","Female","Other"]}
        selected={getSafe("genders") || []}
        onChange={(arr) => setArray("genders", arr)}
        multi
        placeholder="Gender"
      />

      <FilterDropdown
        label="Age Range"
        items={[ "0-18","19-25","26-35","36-50","50+" ]}
        selected={getSafe("ageRanges") || []}
        onChange={(arr) => {
          // translate age range selection into ageMin/ageMax params
          if (!arr || arr.length === 0) {
            updateParams(prev => ({ ...prev, ageMin: undefined, ageMax: undefined, ageRanges: [], page: 1 }));
            return;
          }
          // choose first selected range only for simplicity (you can expand)
          const r = arr[arr.length - 1];
          let [min, max] = [undefined, undefined];
          if (r === "0-18") { min = 0; max = 18; }
          if (r === "19-25") { min = 19; max = 25; }
          if (r === "26-35") { min = 26; max = 35; }
          if (r === "36-50") { min = 36; max = 50; }
          if (r === "50+") { min = 51; max = 200; }
          updateParams(prev => ({ ...prev, ageRanges: arr, ageMin: min, ageMax: max, page: 1 }));
        }}
        multi
        placeholder="Age"
      />

      <FilterDropdown
        label="Product Category"
        items={facets.categories || []}
        selected={getSafe("productCategories")}
        onChange={(arr) => setArray("productCategories", arr)}
        multi
        placeholder="Category"
      />

      <FilterDropdown
        label="Tags"
        items={facets.tags || []}
        selected={getSafe("tags")}
        onChange={(arr) => setArray("tags", arr)}
        multi
        placeholder="Tags"
      />

      <FilterDropdown
        label="Payment Method"
        items={facets.payments || []}
        selected={getSafe("paymentMethods")}
        onChange={(arr) => setArray("paymentMethods", arr)}
        multi
        placeholder="Payment"
      />

      {/* Date controls: using basic inputs so backend can receive dateFrom/dateTo */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label style={{ fontSize: 13, color: "#6b7280" }}>From</label>
        <input
          type="date"
          value={params.dateFrom || ""}
          onChange={(e) => updateParams({ dateFrom: e.target.value || undefined, page: 1 })}
          className="select"
        />
        <label style={{ fontSize: 13, color: "#6b7280" }}>To</label>
        <input
          type="date"
          value={params.dateTo || ""}
          onChange={(e) => updateParams({ dateTo: e.target.value || undefined, page: 1 })}
          className="select"
        />
      </div>
    </div>
  );
}
