import React, { useRef } from "react";
import { FaBookmark, FaChevronRight, FaClock } from "react-icons/fa";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import type { PostEntry } from "~/types/post.type";

interface SeriesCardProps {
  series: string;
  posts: PostEntry[];
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, posts }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);

  // 시리즈의 첫 번째 포스트의 이미지를 커버 이미지로 사용
  const coverImage = posts[0]?.data.ogImage || "/default-blog-image.jpg";

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <article className="group relative h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
        {/* 커버 이미지 영역 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={coverImage.toString()}
            alt={series}
            className="h-full w-full object-cover transition-transform duration-500"
          />
          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* 시리즈 정보 오버레이 */}
          <div className="absolute bottom-0 w-full p-4">
            <div className="mb-2 flex items-center gap-2">
              <FaBookmark className="h-4 w-4 text-skin-accent" />
              <h3 className="text-lg font-bold text-white-accent md:text-xl">
                {series}
              </h3>
            </div>
            <p className="text-white/80 text-sm">{posts.length}개의 포스트</p>
          </div>
        </div>

        {/* 포스트 목록 */}
        <div className="p-4">
          <ul className="h-[216px] space-y-3">
            {posts.slice(0, 3).map((post, index) => (
              <li
                key={post.id}
                className="group/item flex h-[64px] items-start gap-3 rounded-lg p-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-skin-accent/10 text-xs font-bold text-skin-accent">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h4 className="line-clamp-1 font-medium text-black-accent">
                    {post.data.title}
                  </h4>
                </div>
              </li>
            ))}
            {[...Array(Math.max(0, 3 - posts.length))].map((_, index) => (
              <li key={`empty-${index}`} className="h-[64px]" />
            ))}
          </ul>

          {
            <a
              href={`/series/${encodeURIComponent(series)}`}
              className="block touch-manipulation"
              onClick={e => {
                // 스크롤 중일 때는 클릭 이벤트 방지
                if (e.currentTarget.dataset.scrolling === "true") {
                  e.preventDefault();
                  return;
                }
              }}
            >
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-black-muted">
                  {posts.length > 3
                    ? `외 ${posts.length - 3}개의 포스트`
                    : "시리즈 전체보기"}
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-skin-accent">
                  시리즈 보기
                  <FaChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
              <div className="text-white absolute bottom-4 right-4 rounded-full bg-skin-accent px-4 py-2 text-sm font-medium opacity-0 transition-all duration-300 active:scale-95 group-hover:opacity-100 md:hidden">
                <span>시리즈 보기</span>
              </div>
            </a>
          }
        </div>
      </article>
    </div>
  );
};

export default SeriesCard;
