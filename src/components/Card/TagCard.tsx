import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import type { TagAndCount } from "~utils/getPosts";

interface TagCardProps extends TagAndCount {
  index: number;
}

const TagCard: React.FC<TagCardProps> = ({ tag, count }) => {
  return (
    <motion.a
      href={`/blog/tags/${tag}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 0.2,
      }}
      className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* 태그 이름 */}
        <h3 className="text-lg font-medium text-black-accent transition-colors group-hover:text-skin-accent">
          {tag}
        </h3>

        {/* 하단 정보 */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-black-muted">{count}개의 포스트</span>

          <motion.span className="flex h-6 w-6 items-center justify-center rounded-full bg-skin-accent/10 text-skin-accent">
            <motion.div whileHover={{ x: 2 }} transition={{ type: "tween" }}>
              <FaArrowRight className="h-3 w-3" />
            </motion.div>
          </motion.span>
        </div>
      </div>

      {/* 배경 효과 - 심플한 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-skin-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </motion.a>
  );
};

export default TagCard;
