import React, { useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchType, setSearchType] = useState<"tag" | "series" | "title">(
    "title",
  );
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black-accent">검색</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {(["title", "tag", "series"] as const).map(type => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`rounded-full px-4 py-2 ${
                searchType === type
                  ? "text-white bg-skin-accent"
                  : "bg-gray-100 text-black-base hover:bg-gray-200"
              }`}
            >
              {type === "title" && "제목"}
              {type === "tag" && "태그"}
              {type === "series" && "시리즈"}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`${
            searchType === "title"
              ? "제목"
              : searchType === "tag"
                ? "태그"
                : "시리즈"
          }로 검색`}
          className="w-full rounded-lg border border-gray-200 p-4 focus:border-skin-accent focus:outline-none"
          autoFocus
        />
      </div>
    </div>
  );
};

export default SearchModal;
