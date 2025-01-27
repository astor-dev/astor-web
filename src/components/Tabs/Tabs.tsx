// src/components/Tabs.jsx
import React, { useState } from "react";

export default function Tabs({
  tabs,
}: {
  tabs: { label: string; content: React.ReactNode }[];
}) {
  // tabs: [{ label: "Tab1", content: <div>...</div> }, ...]
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* 탭 헤더 */}
      <div className="mb-4 flex space-x-2 border-b border-skin-line">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-2 text-skin-base ${
              activeIndex === idx
                ? "border-b-2 border-skin-accent text-skin-accent"
                : "hover:text-skin-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div>{tabs[activeIndex]?.content}</div>
    </div>
  );
}
