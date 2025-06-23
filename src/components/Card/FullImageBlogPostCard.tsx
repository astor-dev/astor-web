import React, { useRef } from "react";
import { FaClock, FaBookmark, FaUser } from "react-icons/fa";
import type { PostEntry } from "~/types/post.type";
import dayjs from "dayjs";
import Tag from "~components/Tag/Tag";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";

interface FullImageBlogPostCardProps extends PostEntry {
  className?: string;
}

const FullImageBlogPostCard: React.FC<FullImageBlogPostCardProps> = props => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);

  const formatDate = (date: string) => {
    return dayjs(date).format("YYYY.MM.DD");
  };

  return (
    <div
      ref={cardRef}
      className={`h-full transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${props.className}`}
    >
      <a
        href={`/blog/posts/${props.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-0.5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <ImageWithSkeleton
            src={props.data.ogImage?.toString() || "/default-blog-image.jpg"}
            alt={props.data.title}
            className="h-full w-full object-cover"
          />
          {/* 어두운 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        {/* 카드 내용 */}
        <article className="relative flex h-full flex-col justify-end p-5">
          {props.data.seriesId && (
            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-skin-accent backdrop-blur-sm">
              <FaBookmark className="mr-1.5 inline-block h-3 w-3" />
              {props.data.seriesId}
            </div>
          )}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {/* 시리즈 뱃지 */}
          </div>

          {/* 제목과 설명 */}
          <div className="mt-auto">
            <h3 className="line-clamp-2 text-lg font-bold text-white-accent md:text-xl">
              {props.data.title}
            </h3>
            <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-skin-inverted"></p>
          </div>

          {/* 하단 메타 정보 */}
          <div className="mt-4 flex flex-col gap-3">
            {/* 태그 */}
            <div className="line-clamp-1 flex gap-1.5 overflow-hidden">
              {props.data.tags.map((tag, index) => (
                <Tag
                  key={index}
                  tag={tag}
                  size="sm"
                  className="bg-white/20 text-white-base hover:bg-white/30"
                />
              ))}
            </div>

            {/* 날짜와 작성자 */}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center">
                <FaClock className="mr-1.5 h-3 w-3 opacity-70" />
                <time dateTime={props.data.createdAt}>
                  {formatDate(props.data.createdAt)}
                </time>
              </div>
              <span className="flex items-center">
                <FaUser className="mr-1.5 h-3 w-3 opacity-70" />
                {props.data.author}
              </span>
            </div>
          </div>
        </article>
      </a>
    </div>
  );
};

export default FullImageBlogPostCard;
