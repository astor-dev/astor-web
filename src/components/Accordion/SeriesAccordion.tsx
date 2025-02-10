import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface SeriesAccordionProps {
  series: string;
  posts: { id: string; data: { title: string } }[];
}

const SeriesAccordion: React.FC<SeriesAccordionProps> = ({ series, posts }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-skin-accent/20">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex w-full items-center justify-between p-4 text-black-accent transition-colors hover:bg-skin-accent/5"
      >
        <span className="text-lg font-bold">{series}</span>
        <FaChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {open && (
        <div className="bg-skin-background p-4">
          <ul className="space-y-2">
            {posts.map(post => (
              <li key={post.id} className="text-sm text-black-base">
                {post.data.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SeriesAccordion;
