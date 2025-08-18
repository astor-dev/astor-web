import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tag from "~features/blog/components/tags/common-tag";
import type { Tag as TagType } from "~common/types/post.type";

interface MobileTagScrollProps {
  tags: TagType[];
  totalPosts: number;
  className?: string;
}

const TagScrollSpacer = () => {
  return <div className="min-h-[2rem] w-3 flex-shrink-0" />;
};

/**
 * MobileTagScroll 컴포넌트
 *
 * 모바일 환경 전용 가로 스크롤 태그 섹션입니다.
 * framer-motion의 drag를 사용하여 태그들을 드래그할 수 있습니다.
 */
const MobileTagScroll: React.FC<MobileTagScrollProps> = ({
  tags,
  totalPosts,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      const totalScrollWidth = scrollRef.current.scrollWidth;
      const visibleWidth = scrollRef.current.offsetWidth;
      // 드래그 가능한 최대 거리
      setScrollWidth(totalScrollWidth - visibleWidth);
    }
  }, [tags]);

  return (
    <div
      className={`my-4 -ml-[5dvw] -mr-[5dvw] w-[calc(100%+10dvw)] overflow-hidden 2xl:-mx-[15dvw] ${className}`}
    >
      <motion.div
        ref={scrollRef}
        drag="x"
        dragConstraints={{ right: 0, left: -scrollWidth }}
        className="flex cursor-grab space-x-1 active:cursor-grabbing"
      >
        <TagScrollSpacer />
        <Tag tag="전체보기" href="/blog" count={totalPosts} size="sm" />
        {tags.map((tag, index) => (
          <Tag
            key={index}
            tag={tag.tag}
            href={`/blog/tags/${tag.tag}`}
            count={tag.count}
            size="sm"
          />
        ))}
        <TagScrollSpacer />
      </motion.div>
    </div>
  );
};

export default MobileTagScroll;
