import React from "react";
import type { Tag } from "~types/post.type";

export interface TagSidebarProps {
  tags: Tag[];
}

const TagSidebar: React.FC<TagSidebarProps> = ({ tags }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-black-accent">태그 목록</h2>
      <ul className="space-y-2">
        {tags.map(tag => (
          <a href={`/blog/tag/${tag.tag}`}>
            <li
              key={tag.tag}
              className="flex items-center justify-between rounded bg-skin-fill/5 p-2 hover:bg-skin-accent/5"
            >
              <span className="text-sm font-medium text-black-accent">
                {tag.tag}
              </span>
              <span className="text-xs text-black-muted">{tag.count}</span>
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default TagSidebar;
