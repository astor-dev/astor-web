import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { PostTitleAndId, SeriesAndCount, Tag } from "~types/post.type";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  series: SeriesAndCount[];
  posts: PostTitleAndId[];
}

const SearchModal = ({
  isOpen,
  onClose,
  tags,
  series,
  posts,
}: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "tags" | "series">(
    "posts",
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ESC 키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      inputRef.current?.focus();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 모달 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 검색어에 따른 글(포스트) 필터링
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        // 모달 전체에 고정 높이와 overflow-hidden 추가
        className="flex h-[600px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 md:p-6">
          <h2 className="text-xl font-bold text-black-accent">검색</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* 검색 입력 영역 */}
        <div className="p-4 md:p-6">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="검색어 입력 (제목)"
            className="border-skin-base w-full rounded-lg border p-3 text-black-base focus:border-skin-accent focus:outline-none"
          />
        </div>

        {/* 결과 영역: 내부 탭과 스크롤 가능한 컨텐츠 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 탭 네비게이션 */}
          <div className="mb-4 border-b border-gray-200 px-4 md:px-6">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "posts"
                    ? "border-b-2 border-skin-accent text-black-accent"
                    : "text-gray-500"
                }`}
              >
                글
              </button>
              <button
                onClick={() => setActiveTab("tags")}
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "tags"
                    ? "border-b-2 border-skin-accent text-black-accent"
                    : "text-gray-500"
                }`}
              >
                태그
              </button>
              <button
                onClick={() => setActiveTab("series")}
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "series"
                    ? "border-b-2 border-skin-accent text-black-accent"
                    : "text-gray-500"
                }`}
              >
                시리즈
              </button>
            </nav>
          </div>

          {/* 스크롤 가능한 결과 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6">
            {activeTab === "posts" && (
              <>
                {searchQuery ? (
                  filteredPosts.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {filteredPosts.map(post => (
                        <a
                          key={post.id}
                          href={`/blog/detail/${post.id}`}
                          className="rounded-lg bg-white p-3 text-left text-black-base hover:bg-skin-accent hover:text-white-base"
                        >
                          {post.title}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      검색 결과가 없습니다.
                    </div>
                  )
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    검색어를 입력해주세요.
                  </div>
                )}
              </>
            )}

            {activeTab === "tags" && (
              <div className="flex flex-wrap gap-2">
                {tags.map(({ tag, count }) => (
                  <a
                    key={tag}
                    href={`/blog/tags/${tag}`}
                    className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-black-base hover:bg-skin-accent hover:text-white-base"
                  >
                    <span>{tag}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {count}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {activeTab === "series" && (
              <div className="flex flex-col gap-2">
                {series.map(({ series, count }) => (
                  <a
                    key={series.data.id}
                    href={`/blog/series/${series.data.id}`}
                    className="flex flex-col gap-1 rounded-lg bg-white p-3 text-left text-black-base hover:bg-skin-accent hover:text-white-base"
                  >
                    <span className="font-medium">{series.data.name}</span>
                    <span className="text-xs text-skin-base">
                      {count}개의 포스트
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default SearchModal;
