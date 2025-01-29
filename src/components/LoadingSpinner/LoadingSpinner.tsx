// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ className }: { className: string }) {
  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-skin-accent border-t-transparent"></div>
    </div>
  );
}
