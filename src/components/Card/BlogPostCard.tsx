import React, { useEffect, useRef, useState } from "react";
import { FaClock, FaBookmark, FaUser } from "react-icons/fa";
import type { PostEntry } from "~/types/post.type";
import dayjs from "dayjs";
import Tag from "~components/Tag/Tag";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import { remark } from "remark";
import strip from "strip-markdown";
import Skeleton from "react-loading-skeleton";
interface BlogPostCardProps extends PostEntry {
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = props => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    remark()
      .use(strip)
      .process(props.body)
      .then(result => {
        setBody(result.toString());
        setIsLoading(false);
      });
  }, [props.body]);

  const formatDate = (date: string) => dayjs(date).format("YYYY.MM.DD");

  return (
    <div ref={cardRef} className={` ${props.className ?? ""} h-[500px] w-full`}>
      <a
        href={`/blog/posts/${props.id}`}
        className="group relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-transparent via-transparent to-skin-fill/5"
      >
        {/* 상단: 이미지 영역 (전체 높이의 2/3) */}
        <div className="relative aspect-[16/9] h-2/3 w-full overflow-hidden">
          <ImageWithSkeleton
            src={props.data.ogImage?.toString() || "/default-blog-image.jpg"}
            alt={props.data.title}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* {props.data.series && (
            <div className="absolute left-2 top-2">
              {isLoading ? (
                <Skeleton className="h-3 w-3" />
              ) : (
                <span className="inline-block rounded bg-skin-accent px-2 py-1 text-xs font-bold text-white-accent">
                  <FaBookmark className="mr-1 inline h-3 w-3" />
                  {props.data.series}
                </span>
              )}
            </div>
          )} */}
        </div>

        <div className="flex flex-1 flex-col justify-between py-3">
          <div>
            <h3 className="mb-1 line-clamp-1 text-lg font-bold text-black-accent md:text-xl">
              {isLoading ? <Skeleton className="w-full" /> : props.data.title}
            </h3>
            <p className="line-clamp-2 h-[2.5rem] text-sm">
              {isLoading ? (
                <Skeleton className="h-full" />
              ) : (
                props.data.description
              )}
            </p>
          </div>
          <div className="my-3 line-clamp-6 min-h-[7.5rem] text-sm text-black-muted">
            {isLoading ? <Skeleton className="h-full" /> : body}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaClock className="h-3 w-3" />
            <time dateTime={props.data.createdAt}>
              {isLoading ? <Skeleton /> : formatDate(props.data.createdAt)}
            </time>
            <FaUser className="h-3 w-3" />
            <span>{isLoading ? <Skeleton /> : props.data.author}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default BlogPostCard;
