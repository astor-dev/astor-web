import React from "react";
import type { Tag } from "~types/post.type";

export interface TagSidebarProps {
  tags: Tag[];
  totalPosts: number;
  className?: string;
}

const TagSidebar: React.FC<TagSidebarProps> = ({
  tags,
  totalPosts,
  className,
}) => {
  return (
    <div className={`rounded-lg bg-white px-3 ${className}`}>
      <h2 className="mb-4 border-b border-gray-200 pb-1 text-2xl font-bold text-black-accent">
        태그 목록
      </h2>
      <ul className="space-y-1">
        {/* 제일 앞은 전체보기 */}
        <li
          key="all"
          className="flex items-center justify-between rounded bg-skin-fill/5 hover:bg-skin-accent/5"
        >
          <a href="/blog" className="flex w-full items-center justify-between">
            <span className="text-sm font-medium text-black-accent">
              전체보기
            </span>
            <span className="text-xs text-black-muted">{totalPosts}</span>
          </a>
        </li>

        {tags.map((tag, index) => (
          <li
            key={tag.tag + "/" + index}
            className="flex items-center justify-between rounded bg-skin-fill/5 py-1 hover:bg-skin-accent/5"
          >
            <a
              href={`/blog/tags/${tag.tag}`}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-medium text-black-accent">
                {tag.tag}
              </span>
              <span className="text-xs text-black-muted">{tag.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagSidebar;
