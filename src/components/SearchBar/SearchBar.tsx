// src/components/SearchBar.jsx
import React, { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (keyword: string) => void;
}) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요..."
        className="focus:ring-skin-accent w-full rounded-md border border-skin-line bg-skin-card px-3 py-2 text-skin-base focus:outline-none focus:ring-1"
      />
      <button
        type="submit"
        className="rounded-md bg-skin-accent px-4 py-2 text-skin-inverted hover:bg-skin-accent/80"
      >
        검색
      </button>
    </form>
  );
}
