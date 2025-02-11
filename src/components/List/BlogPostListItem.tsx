import React from "react";
import { FaClock, FaBookmark, FaUser } from "react-icons/fa";
import type { PostEntry } from "~/types/post.type";
import dayjs from "dayjs";
import Tag from "~components/Tag/Tag";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";

interface BlogPostListItemProps extends PostEntry {
  className?: string;
}

const BlogPostListItem: React.FC<BlogPostListItemProps> = props => {
  const formatDate = (date: string) => {
    return dayjs(date).format("YYYY.MM.DD");
  };

  return (
    <a
      href={`/blog/detail/${props.id}`}
      className={`group block w-full border-b border-gray-100 px-3 py-6 transition-colors hover:bg-gray-100 ${props.className}`}
    >
      <article className="flex gap-6">
        {/* 썸네일 이미지 */}
        <div className="relative hidden aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-lg sm:block md:w-[240px]">
          <ImageWithSkeleton
            src={props.data.ogImage?.toString() || "/default-blog-image.jpg"}
            alt={props.data.title}
            className="h-full w-full object-cover"
          />
          {props.data.series && (
            <div className="absolute left-1.5 top-1.5 rounded-full bg-skin-fill/95 px-1.5 py-0.5 text-[10px] font-medium text-skin-accent backdrop-blur-sm md:left-2 md:top-2 md:px-2 md:py-1 md:text-xs">
              <FaBookmark className="mr-0.5 inline-block h-2.5 w-2.5 md:mr-1 md:h-3 md:w-3" />
              {props.data.series}
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-auto">
            <h3 className="line-clamp-1 text-base font-bold text-black-accent md:text-xl">
              {props.data.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-black-base md:mt-2 md:line-clamp-2 md:text-base">
              {props.data.description}
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-2 md:mt-4 md:gap-3">
            {/* 태그 */}
            <div className="flex overflow-hidden">
              <div className="flex flex-nowrap gap-1.5">
                {props.data.tags.map((tag, index) => (
                  <Tag key={index} tag={tag} />
                ))}
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center gap-3 text-[11px] text-black-muted md:gap-4 md:text-xs">
              <div className="flex items-center">
                <FaClock className="mr-1 h-2.5 w-2.5 opacity-70 md:mr-1.5 md:h-3 md:w-3" />
                <time dateTime={props.data.createdAt}>
                  {formatDate(props.data.createdAt)}
                </time>
              </div>
              <span className="flex items-center">
                <FaUser className="mr-1 h-2.5 w-2.5 opacity-70 md:mr-1.5 md:h-3 md:w-3" />
                {props.data.author}
              </span>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
};

export default BlogPostListItem;
