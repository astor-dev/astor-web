import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentTag?: string;
}

const Pagination: React.FC<PaginationProps> = ({
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

  // 전체 페이지 수 만큼 페이지 배열 생성
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mb-8 mt-8 flex justify-center">
      <ul className="flex gap-2">
        {currentPage > 1 && (
          <li>
            <a
              href={createLink(currentPage - 1)}
              className="rounded-2xl bg-skin-fill/5 px-3 py-1 text-black-accent shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              &laquo; 이전
            </a>
          </li>
        )}
        {pages.map(page => (
          <li key={page}>
            <a
              href={createLink(page)}
              className={`rounded-2xl px-3 py-1 text-black-accent shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                page === currentPage
                  ? "bg-skin-accent text-white-accent"
                  : "bg-skin-fill/5 hover:bg-skin-fill/10"
              }`}
            >
              {page}
            </a>
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <a
              href={createLink(currentPage + 1)}
              className="rounded-2xl bg-skin-fill/5 px-3 py-1 text-black-accent shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              다음 &raquo;
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
