import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tag from "./Tag";
import type { Tag as TagType } from "~types/post.type";

interface MobileTagScrollProps {
  tags: TagType[];
  className?: string;
}

/**
 * MobileTagScroll 컴포넌트
 *
 * 모바일 환경 전용 가로 스크롤 태그 섹션입니다.
 * framer-motion의 drag를 사용하여 태그들을 드래그할 수 있습니다.
 */
const MobileTagScroll: React.FC<MobileTagScrollProps> = ({
  tags,
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
    <div className={`m-4 w-full overflow-hidden ${className}`}>
      <motion.div
        ref={scrollRef}
        drag="x"
        dragConstraints={{ right: 0, left: -scrollWidth }}
        className="flex cursor-grab space-x-1 active:cursor-grabbing"
      >
        <Tag tag="전체보기" href="/blog" count={tags.length} size="sm" />
        {tags.map((tag, index) => (
          <Tag
            key={index}
            tag={tag.tag}
            href={`/blog/tags/${tag.tag}`}
            count={tag.count}
            size="sm"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default MobileTagScroll;
