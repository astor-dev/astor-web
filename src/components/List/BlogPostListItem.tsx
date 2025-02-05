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
      className={`group block w-full border-b border-gray-100 py-6 transition-colors hover:bg-gray-50/50 ${props.className}`}
    >
      <article className="flex gap-6">
        {/* 썸네일 이미지 */}
        <div className="relative aspect-[4/3] w-[180px] shrink-0 overflow-hidden rounded-lg md:w-[240px]">
          <ImageWithSkeleton
            src={props.data.ogImage?.toString() || "/default-blog-image.jpg"}
            alt={props.data.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {props.data.series && (
            <div className="absolute left-2 top-2 rounded-full bg-skin-fill/95 px-2 py-1 text-xs font-medium text-skin-accent backdrop-blur-sm">
              <FaBookmark className="mr-1 inline-block h-3 w-3" />
              {props.data.series}
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-1 flex-col">
          <div className="mb-auto">
            <h3 className="text-lg font-bold text-black-accent transition-colors group-hover:text-skin-accent md:text-xl">
              {props.data.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-black-base md:text-base">
              {props.data.description}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* 태그 */}
            <div className="flex flex-wrap gap-1.5">
              {props.data.tags.map((tag, index) => (
                <Tag key={index} text={tag} size="sm" />
              ))}
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-xs text-black-muted">
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
  );
};

export default BlogPostListItem;
