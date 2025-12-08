import React, { useEffect, useRef, useState } from "react";

export default function FilterDropdown({
  label,
  items = [],
  selected = [],
  onChange,
  multi = true,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const isSelected = (v) => (selected || []).indexOf(v) >= 0;

  const toggle = (v) => {
    if (multi) {
      const curr = Array.isArray(selected) ? [...selected] : [];
      const idx = curr.indexOf(v);
      if (idx >= 0) curr.splice(idx, 1);
      else curr.push(v);
      onChange(curr);
    } else {
      onChange(selected === v ? [] : [v]);
      setOpen(false);
    }
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div
      ref={ref}
      className="filter-dropdown"
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        onClick={() => setOpen((s) => !s)}
        className="chip"
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        title={label}
      >
        <span style={{ marginRight: 8, fontWeight: 600 }}>{label}</span>
        <span style={{ opacity: 0.6, fontSize: 13 }}>
          {selected && selected.length ? selected.length : placeholder || ""}
        </span>
      </button>

      {open && (
        <div
          className="dd-panel panel"
          style={{
            position: "absolute",
            left: 0,
            top: "calc(100% + 8px)",
            zIndex: 60,
            minWidth: 220,
            boxShadow: "0 6px 18px rgba(20,20,40,0.08)",
          }}
        >
          <div style={{ maxHeight: 260, overflow: "auto", padding: 8 }}>
            {items.length === 0 ? (
              <div style={{ color: "#6b7280", padding: 8 }}>No options</div>
            ) : (
              items.map((item) => {
                const val = typeof item === "string" ? item : item.value;
                const lab = typeof item === "string" ? item : item.label;
                return (
                  <label
                    key={val}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(val)}
                      onChange={() => toggle(val)}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 14 }}>{lab}</span>
                  </label>
                );
              })
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid #eee",
              padding: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Apply
            </button>
            <button
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                clear(e);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
