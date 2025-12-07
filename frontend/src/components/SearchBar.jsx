import { useState } from "react";

export default function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(text);
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search customer name or phone"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input"
      />
      <button className="btn">Search</button>
    </form>
  );
}
