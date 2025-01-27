// src/components/Card.jsx
import React from "react";

export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`bg-skin-card border-skin-line shadow-sm rounded-md border p-4 ${className}`}
    >
      {title && (
        <h2 className="text-skin-base mb-2 text-xl font-semibold">{title}</h2>
      )}
      {subtitle && <p className="text-skin-base/70 mb-4 text-sm">{subtitle}</p>}
      {children}
    </div>
  );
}
