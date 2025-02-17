import React, { useRef } from "react";
import { FaClock, FaBookmark, FaUser } from "react-icons/fa";
import type { PostEntry } from "~/types/post.type";
import dayjs from "dayjs";
import Tag from "~components/Tag/Tag";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";

interface BlogPostCardProps extends PostEntry {
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = props => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);

  const formatDate = (date: string) => dayjs(date).format("YYYY.MM.DD");

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${props.className ?? ""} h-full w-full`}
    >
      <a
        href={`/blog/detail/${props.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-transparent via-transparent to-skin-fill/5 transition-all duration-300 hover:-translate-y-1"
      >
        {/* 상단: 이미지 영역 (전체 높이의 2/3) */}
        <div className="relative aspect-[16/9] h-2/3 w-full overflow-hidden rounded-2xl">
          <ImageWithSkeleton
            src={props.data.ogImage?.toString() || "/default-blog-image.jpg"}
            alt={props.data.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* 이미지 위에 시리즈 태그 오버레이 */}
          {props.data.series && (
            <div className="absolute left-2 top-2">
              <span className="inline-block rounded bg-skin-accent px-2 py-1 text-xs font-bold text-white-accent">
                <FaBookmark className="mr-1 inline h-3 w-3" />
                {props.data.series}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-3">
          <div>
            <h3 className="mb-1 line-clamp-1 text-lg font-bold text-black-accent md:text-xl">
              {props.data.title}
            </h3>
            <p className="line-clamp-2 text-sm text-black-muted">
              {props.data.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaClock className="h-3 w-3" />
            <time dateTime={props.data.createdAt}>
              {formatDate(props.data.createdAt)}
            </time>
            <FaUser className="h-3 w-3" />
            <span>{props.data.author}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default BlogPostCard;
