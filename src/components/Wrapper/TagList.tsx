import { useEffect, useState } from "react";
import TagSidebar from "~components/Sidebar/TagSidebar";
import MobileTagScroll from "~components/Tag/MobileTagScroll";
import type { Tag } from "~types/post.type";

interface Props {
  tags: Tag[];
}

/**
 * 모바일과 다른 뷰포트에서 아예 다른 뷰를 렌더링 할 때 쓰는 컴포넌트
 *
 * @param mobile - 모바일 뷰
 * @param other - 다른 뷰포트 뷰
 * @returns 모바일과 다른 뷰포트에서 아예 다른 뷰를 렌더링 할 때 쓰는 컴포넌트
 */
export default function TagList({ tags }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div>
      {isMobile ? <MobileTagScroll tags={tags} /> : <TagSidebar tags={tags} />}
    </div>
  );
}
