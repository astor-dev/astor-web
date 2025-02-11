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
        href={`/blog/detail/${props.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-skin-fill/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* 카드 내용 */}
        <article className="relative flex h-full flex-col rounded-[14px] bg-white">
          {/* 썸네일 이미지 - 16:9 비율 */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <ImageWithSkeleton
              src={props.data.ogImage?.toString() || "/default-blog-image.jpg"}
              alt={props.data.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* 시리즈 뱃지 */}
            {props.data.series && (
              <div className="absolute left-4 top-4 rounded-full bg-skin-fill/95 px-2.5 py-1 text-xs font-medium text-skin-accent backdrop-blur-sm">
                <FaBookmark className="mr-1.5 inline-block h-3 w-3" />
                {props.data.series}
              </div>
            )}
          </div>

          <div className="flex h-full flex-col p-5">
            {/* 제목과 설명 영역 */}
            <div className="mb-auto">
              <h3 className="line-clamp-1 text-lg font-bold text-black-accent md:text-xl">
                {props.data.title}
              </h3>
              <p className="mt-2 line-clamp-3 min-h-[2.5rem] text-sm text-black-muted">
                {props.data.description}
              </p>
            </div>

            {/* 하단 메타 정보 영역: mt-auto로 항상 하단에 위치 */}
            <div className="mt-auto flex flex-col gap-3">
              {/* 태그 영역 */}
              <div className="line-clamp-1 flex gap-1.5 overflow-hidden">
                {props.data.tags.map((tag, index) => (
                  <Tag key={index} text={tag} size="sm" />
                ))}
              </div>

              {/* 날짜와 작성자 */}
              <div className="flex items-center justify-between text-xs text-black-muted">
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
          </div>
        </article>
      </a>
    </div>
  );
};

export default BlogPostCard;
