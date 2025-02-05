import type { SeriesAndPosts } from "~utils/getPosts";
import { FaBookmark, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export const SeriesSection = ({ series, posts }: SeriesAndPosts) => {
  const coverImage = posts[0]?.data.ogImage || "/default-blog-image.jpg";

  return (
    <section className="mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-black to-gray-900">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      <div className="relative">
        {/* 헤더 영역 */}
        <div className="relative flex flex-col items-center px-6 py-12 text-center md:py-16">
          <div className="mb-6 flex items-center gap-2">
            <FaBookmark className="h-5 w-5 text-skin-accent" />
            <h2 className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              {series}
            </h2>
          </div>
          <p className="text-lg text-white-base/80">
            {posts.length}개의 시리즈 포스트
          </p>

          {/* 장식용 원형 그라데이션 */}
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-skin-accent/20 blur-3xl" />
          <div className="absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-skin-accent/10 blur-2xl" />
        </div>

        {/* 포스트 목록 */}
        <div className="relative space-y-4 px-6 pb-12">
          {posts.slice(0, 3).map((post, index) => (
            <a
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block overflow-hidden rounded-xl bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-skin-accent/20 text-sm font-bold text-skin-base">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-bold text-white-accent transition-colors group-hover:text-skin-accent">
                    {post.data.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-white-base/70">
                    {post.data.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 하단 더보기 버튼 */}
        <div className="flex items-center justify-center pb-12">
          <a
            href={`/blog/series/${series}`}
            className="text-white group inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            전체보기
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 장식용 별들 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute left-[20%] top-[60%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute right-[15%] top-[30%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute right-[25%] top-[70%] h-1 w-1 rounded-full bg-white" />
          {/* 추가 별들... */}
        </div>
      </div>
    </section>
  );
};
