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
  const coverImage = posts[0]?.data.ogImage || "/default-blog-image.jpg";

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <article className="group relative h-[380px] overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={coverImage.toString()}
            alt={series}
            className="h-full w-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 w-full p-3">
            <div className="flex items-center gap-2">
              <FaBookmark className="h-4 w-4 text-skin-accent" />
              <h3 className="text-base font-bold text-white-accent">
                {series}
              </h3>
              {/* <span className="ml-auto text-sm text-white-base/80">
                {posts.length}개의 포스트
              </span> */}
            </div>
          </div>
        </div>

        <div className="flex h-[196px] flex-col p-3">
          <div className="h-[140px] overflow-hidden">
            <ul className="space-y-2">
              {posts.map((post, index) => (
                <li key={post.id} className="flex items-center gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-skin-accent/10 text-xs font-medium text-skin-accent">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h4 className="flex-1 truncate font-medium text-black-accent">
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
