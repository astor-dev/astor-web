import React, { useEffect, useRef, useState } from "react";
import type { PostEntry } from "~common/types/post.type";

import { remark } from "remark";
import strip from "strip-markdown";
import Skeleton from "react-loading-skeleton";
import ImageWithSkeleton from "~common/components/skeletons/image-with-skeleton";

interface BlogPostCardProps extends PostEntry {
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = props => {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [titleLines, setTitleLines] = useState<1 | 2>(2); // 제목 줄 수 상태

  useEffect(() => {
    remark()
      .use(strip)
      .process(props.body)
      .then(result => {
        setBody(result.toString());
        setIsLoading(false);
      });
  }, [props.body]);

  // 제목의 실제 줄 수를 계산하는 함수
  useEffect(() => {
    const calculateTitleLines = () => {
      if (!titleRef.current || isLoading) return;

      const titleElement = titleRef.current;
      const styles = window.getComputedStyle(titleElement);
      const lineHeight = parseFloat(styles.lineHeight);
      const actualHeight = titleElement.scrollHeight;

      // 실제 줄 수 계산 (1줄 또는 2줄)
      const calculatedLines = Math.round(actualHeight / lineHeight);
      setTitleLines(calculatedLines <= 1 ? 1 : 2);
    };

    // 로딩이 완료되고 DOM이 렌더링된 후 계산
    if (!isLoading) {
      const timer = setTimeout(calculateTitleLines, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, props.data.title]);

  // 제목 줄 수에 따른 본문 클래스 결정
  const getBodyClasses = () => {
    if (titleLines === 1) {
      return "mt-3 mb-1 line-clamp-4 min-h-[5rem] text-sm text-black-muted md:line-clamp-5 md:min-h-[5.05rem]";
    } else {
      return "my-1 line-clamp-3 min-h-[3.75rem] text-sm text-black-muted md:line-clamp-4 md:min-h-[4.8rem]";
    }
  };

  return (
    <div
      ref={cardRef}
      className={` ${props.className ?? ""} h-[300px] w-full md:h-[350px]`}
    >
      <a
        href={`/blog/posts/${props.id}`}
        className="group relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-transparent via-transparent to-skin-fill/5"
      >
        {/* 상단: 이미지 영역 (전체 높이의 2/3) */}
        <div className="relative aspect-[16/9] h-2/3 w-full overflow-hidden">
          <ImageWithSkeleton
            src={props.data.ogImage?.toString() ?? ""}
            alt={props.data.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between py-3">
          <div>
            <h3
              ref={titleRef}
              className="line-clamp-2 text-lg font-bold text-black-accent md:text-xl"
            >
              {isLoading ? <Skeleton className="w-full" /> : props.data.title}
            </h3>
            {/* <p className="line-clamp-2 h-[2.5rem] text-sm">
              {isLoading ? (
                <Skeleton className="h-full" />
              ) : (
                props.data.description
              )}
            </p> */}
          </div>
          <div className={getBodyClasses()}>
            {isLoading ? <Skeleton className="h-full" /> : body}
          </div>
        </div>
      </a>
    </div>
  );
};

export default BlogPostCard;
