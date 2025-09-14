import React, { useMemo } from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentTag?: string;
}

const PostPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  currentTag,
}) => {
  // 태그가 있을 경우와 없을 경우의 링크를 지정
  const createLink = (page: number) => {
    return currentTag && currentTag.trim() !== ""
      ? `/blog/tags/${encodeURIComponent(currentTag)}/pages/${page}`
      : `/blog/pages/${page}`;
  };

  // 반응형 페이지 번호 생성
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      // 7페이지 이하면 모든 페이지 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 현재 페이지 주변의 페이지들 계산
    const delta = 2; // 현재 페이지 양옆으로 보여줄 페이지 수
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = useMemo(
    () => getVisiblePages(),
    [currentPage, totalPages],
  );

  return (
    <nav className="flex justify-center">
      <ul className="flex flex-wrap gap-1 md:gap-2">
        <li>
          {currentPage > 1 ? (
            <a
              href={createLink(currentPage - 1)}
              className="rounded-2xl bg-skin-fill/5 px-2 py-1 text-sm text-black-accent transition-all duration-300 hover:-translate-y-1 hover:bg-skin-fill/10 md:px-3 md:text-base"
            >
              <span className="hidden md:inline">&laquo; 이전</span>
              <span className="md:hidden">‹</span>
            </a>
          ) : (
            <span className="cursor-not-allowed rounded-2xl bg-skin-fill/5 px-2 py-1 text-sm text-black-accent/30 md:px-3 md:text-base">
              <span className="hidden md:inline">&laquo; 이전</span>
              <span className="md:hidden">‹</span>
            </span>
          )}
        </li>
        {visiblePages.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-2 py-1 text-sm text-black-accent/50 md:px-3 md:text-base">
                ...
              </span>
            ) : (
              <a
                href={
                  page === currentPage ? undefined : createLink(page as number)
                }
                tabIndex={page === currentPage ? -1 : 0}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-1 py-0 text-sm text-black-accent md:text-base ${
                  page === currentPage
                    ? "pointer-events-none cursor-not-allowed font-semibold text-skin-accent"
                    : "hover:border-b hover:border-black"
                }`}
              >
                {page}
              </a>
            )}
          </li>
        ))}
        <li>
          {currentPage < totalPages ? (
            <a
              href={createLink(currentPage + 1)}
              className="bg-skin-fill/5 px-2 py-1 text-sm text-black-accent transition-all duration-300 hover:-translate-y-1 hover:bg-skin-fill/10 md:px-3 md:text-base"
            >
              <span className="hidden md:inline">다음 &raquo;</span>
              <span className="md:hidden">›</span>
            </a>
          ) : (
            <span className="cursor-not-allowed bg-skin-fill/5 px-2 py-1 text-sm text-black-accent/30 md:px-3 md:text-base">
              <span className="hidden md:inline">다음 &raquo;</span>
              <span className="md:hidden">›</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default PostPagination;
