import React, { useRef } from "react";
import { FaBookmark, FaChevronRight } from "react-icons/fa";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import type { PostEntry } from "~/types/post.type";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";

interface SeriesCardProps {
  series: string;
  posts: PostEntry[];
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, posts }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);
  const coverImage = posts[0]?.data.ogImage || "/default-blog-image.jpg";

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {/* overflow-hidden 제거하여 그림자 영역이 잘 보이도록 함 */}
      <article className="group relative rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
        {/* 이미지 영역: 고정 비율을 유지하고 overflow-hidden으로 이미지 넘침을 잘라냄 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <ImageWithSkeleton
            src={coverImage.toString()}
            alt={series}
            className="h-full w-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 w-full p-3">
            <div className="flex items-center gap-2">
              <FaBookmark className="h-4 w-4 text-skin-accent" />
              <h3 className="line-clamp-1 text-base font-bold text-white-accent">
                {series}
              </h3>
            </div>
          </div>
        </div>

        {/* 텍스트 영역: 고정 높이를 주어 내부 컨텐츠가 넘치면 잘리도록 함 */}
        <div className="relative flex h-[210px] flex-col p-3">
          <div className="overflow-hidden">
            <ul className="space-y-2">
              {posts.map((post, index) => (
                <li key={post.id} className="flex items-center gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-skin-accent/10 text-xs font-medium text-skin-accent">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h4 className="line-clamp-1 flex-1 truncate font-medium text-black-accent">
                    {post.data.title}
                  </h4>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-3 left-3 right-3 border-t border-gray-100 pt-3">
            <a
              href={`/series/${encodeURIComponent(series)}`}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-black-muted">
                전체 {posts.length}개의 포스트
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-skin-accent">
                시리즈 보기
                <FaChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SeriesCard;
