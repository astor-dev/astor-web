// src/components/Accordion.jsx
import React, { useState } from "react";

export default function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  // items: [{ title: "제목", content: "내용" }, ...]
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-md border border-skin-line bg-skin-card"
        >
          <button
            className="flex w-full items-center justify-between p-3 text-skin-base hover:bg-skin-card-muted"
            onClick={() => toggleItem(idx)}
          >
            <span>{item.title}</span>
            <span className="ml-2">{openIndex === idx ? "▲" : "▼"}</span>
          </button>
          {openIndex === idx && (
            <div className="p-3 pt-0 text-skin-base/80">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
