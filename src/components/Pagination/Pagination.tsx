// src/components/Pagination.jsx
import React from "react";
import Button from "~components/Button/Button";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null; // 페이지가 1개 이하라면 렌더링 X

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Prev
      </Button>
      <span className="px-2 text-skin-base">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
