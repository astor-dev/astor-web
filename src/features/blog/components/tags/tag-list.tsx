import { useState, useEffect } from "react";
import MobileTagScroll from "~features/blog/components/tags/mobile-tag-scroll";
import TagSidebar from "~features/blog/components/tags/tag-sidebar";
import type { Tag } from "~common/types/post.type";

interface Props {
  tags: Tag[];
  totalPosts: number;
}

/**
 * 모바일과 다른 뷰포트에서 아예 다른 뷰를 렌더링 할 때 쓰는 컴포넌트
 *
 * @param mobile - 모바일 뷰
 * @param other - 다른 뷰포트 뷰
 * @returns 모바일과 다른 뷰포트에서 아예 다른 뷰를 렌더링 할 때 쓰는 컴포넌트
 */
export default function TagList({ tags, totalPosts }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div>
      {isMobile ? (
        <MobileTagScroll tags={tags} />
      ) : (
        <TagSidebar tags={tags} totalPosts={totalPosts} />
      )}
    </div>
  );
}
