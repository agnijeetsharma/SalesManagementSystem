import React from "react";
import FilterDropdown from "./FilterDropDown";

export default function Filters(props) {
  const { params = {}, facets = {} } = props;

  const updater = props.updateParams || props.setParams;
  if (typeof updater !== "function") {
    console.error(
      "Filters: missing prop 'updateParams' or 'setParams' (function). Provided props:",
      Object.keys(props)
    );
    return (
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <strong>Filters</strong>
          <button className="btn" onClick={() => {}}>
            Clear
          </button>
        </div>
        <div style={{ color: "#6b7280", padding: 12 }}>
          Filters unavailable (missing updater function)
        </div>
      </div>
    );
  }

  const setArray = (key, arr) => {
    const next = Array.isArray(arr) ? arr : [];
    updater((prev) => ({ ...prev, [key]: next, page: 1 }));
  };

  const getSafe = (key) => (Array.isArray(params[key]) ? params[key] : []);
  const handleAgeRanges = (arr) => {
    if (!arr || arr.length === 0) {
      updater((prev) => ({
        ...prev,
        ageRanges: [],
        ageMin: undefined,
        ageMax: undefined,
        page: 1,
      }));
      return;
    }
    const r = arr[arr.length - 1];
    let min, max;
    switch (r) {
      case "0-18":
        min = 0;
        max = 18;
        break;
      case "19-25":
        min = 19;
        max = 25;
        break;
      case "26-35":
        min = 26;
        max = 35;
        break;
      case "36-50":
        min = 36;
        max = 50;
        break;
      case "50+":
        min = 51;
        max = 200;
        break;
      default:
        min = undefined;
        max = undefined;
    }
    updater((prev) => ({
      ...prev,
      ageRanges: arr,
      ageMin: min,
      ageMax: max,
      page: 1,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
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
        items={["Male", "Female", "Other"]}
        selected={getSafe("genders")}
        onChange={(arr) => setArray("genders", arr)}
        multi
        placeholder="Gender"
      />

      <FilterDropdown
        label="Age Range"
        items={["0-18", "19-25", "26-35", "36-50", "50+"]}
        selected={getSafe("ageRanges")}
        onChange={(arr) => handleAgeRanges(arr)}
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

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label style={{ fontSize: 13, color: "#6b7280" }}>From</label>
        <input
          type="date"
          value={params.dateFrom || ""}
          onChange={(e) =>
            updater((prev) => ({
              ...prev,
              dateFrom: e.target.value || undefined,
              page: 1,
            }))
          }
          className="select"
        />
        <label style={{ fontSize: 13, color: "#6b7280" }}>To</label>
        <input
          type="date"
          value={params.dateTo || ""}
          onChange={(e) =>
            updater((prev) => ({
              ...prev,
              dateTo: e.target.value || undefined,
              page: 1,
            }))
          }
          className="select"
        />
      </div>
    </div>
  );
}
