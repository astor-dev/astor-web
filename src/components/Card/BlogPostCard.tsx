import React from "react";
import { FaClock, FaHashtag } from "react-icons/fa";
import { motion } from "framer-motion";
import type { PostEntry } from "~/types/post.type";

const BlogPostCard: React.FC<PostEntry> = props => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href={`/blog/${props.id}`}
        className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-skin-fill/5 p-1"
      >
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-skin-accent/5 via-transparent to-skin-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 카드 내용 */}
        <article className="relative rounded-xl bg-white p-6">
          {/* 태그 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {props?.data?.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-skin-accent/10 to-skin-accent/5 px-3 py-1 text-xs font-medium text-skin-accent transition-colors"
              >
                <FaHashtag className="h-2.5 w-2.5 opacity-70" />
                {tag}
              </span>
            ))}
          </div>

          {/* 제목과 부제목 */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-black-accent transition-colors">
              {props?.data?.title}
            </h3>
            <p className="mt-2 text-sm text-black-muted">
              {props?.data?.description}
            </p>
          </div>

          {/* 본문 미리보기 */}
          <p className="mb-4 line-clamp-2 text-base text-black-base/80">
            {props?.data?.description}
          </p>

          {/* 하단 메타 정보 */}
          <div className="flex items-center gap-2 text-xs text-black-muted">
            <FaClock className="h-3 w-3 opacity-70" />
            <time dateTime={props?.data?.createdAt}>
              {props?.data?.createdAt}
            </time>
          </div>

          {/* 호버 시 나타나는 화살표 */}
          <div className="absolute bottom-6 right-6 translate-x-8 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <span className="text-skin-accent">→</span>
          </div>
        </article>
      </a>
    </motion.div>
  );
};

export default BlogPostCard;
