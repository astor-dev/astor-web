// src/components/Skeleton.jsx
import React from "react";

export default function Skeleton({ rows = 3 }) {
  // row 수만큼 가짜 박스 렌더링
  const placeholders = Array.from({ length: rows });

  return (
    <div className="space-y-2">
      {placeholders.map((_, i) => (
        <div
          key={i}
          className="h-4 w-full animate-pulse rounded bg-skin-card-muted"
        />
      ))}
    </div>
  );
}
