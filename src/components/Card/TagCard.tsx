import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import type { TagAndCount } from "~utils/getPosts";

interface TagCardProps extends TagAndCount {}

const TagCard: React.FC<TagCardProps> = ({ tag, count }) => {
  return (
    <motion.a
      href={`/blog/tags/${tag}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "tween", duration: 0.2 }}
      className="group relative flex flex-col justify-between rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-skin-accent">
        {tag}
      </h3>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">{count}개의 포스트</span>
        <FaArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-skin-accent" />
      </div>
    </motion.a>
  );
};

export default TagCard;
