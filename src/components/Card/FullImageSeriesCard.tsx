import type { SeriesAndPosts } from "~utils/getPosts";
import { FaBookmark } from "react-icons/fa";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import { useRef, useCallback } from "react";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import { loadSlim } from "tsparticles-slim";
import { Particles as ReactParticles } from "react-tsparticles";
import type { Engine } from "tsparticles-engine";

export const FullImageSeriesCard = ({ series, posts }: SeriesAndPosts) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);
  const coverImage = posts[0]?.data.ogImage || "/default-blog-image.jpg";

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <a
        href={`/series/${series}`}
        className="group relative block h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#000000] via-[#0C1020] to-[#000000] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* 파티클 효과 (우주 별빛 느낌) */}
        <ReactParticles
          id={`particles-${series}`}
          className="absolute inset-0 z-10"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
              number: {
                density: { enable: true, area: 800 },
                value: 60,
              },
              color: {
                value: ["#ffffff", "#E3E6EC", "#4A4E70"],
              },
              shape: {
                type: ["circle", "star"],
              },
              opacity: {
                value: 0.5,
                random: true,
                animation: {
                  enable: true,
                  speed: 0.5,
                  minimumValue: 0.1,
                  sync: false,
                },
              },
              size: {
                value: { min: 1, max: 3 },
                random: true,
                animation: {
                  enable: true,
                  speed: 0.5,
                  minimumValue: 0.5,
                  sync: false,
                },
              },
              move: {
                enable: true,
                speed: 0.4,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "bounce" },
              },
              rotate: {
                value: 0,
                random: true,
                direction: "clockwise",
                animation: {
                  enable: true,
                  speed: 3,
                  sync: false,
                },
              },
              twinkle: {
                particles: {
                  enable: true,
                  frequency: 0.05,
                  opacity: 0.8,
                },
              },
            },
            detectRetina: true,
          }}
        />

        {/* 배경 이미지와 오버레이 (우주의 깊이를 표현) */}
        <div className="absolute inset-0 opacity-20">
          <ImageWithSkeleton
            src={coverImage as string}
            alt={series}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#0C1020]/70 to-transparent" />
        </div>

        {/* 컨텐츠 */}
        <div className="relative z-20 h-full">
          <div className="mb-6 flex items-center gap-2">
            <FaBookmark className="h-5 w-5 text-skin-accent" />
            <h3 className="text-xl font-bold text-white-base md:text-2xl">
              {series}
            </h3>
          </div>

          {/* 최근 포스트 목록 */}
          <div className="space-y-3">
            {posts.slice(0, 3).map((post, index) => (
              <div
                key={post.id}
                className="flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white-base">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h4 className="line-clamp-1 text-sm font-medium text-white-base/80 transition-colors duration-300 group-hover:text-white-base">
                  {post.data.title}
                </h4>
              </div>
            ))}
          </div>

          {/* 포스트 카운트 */}
          <div className="absolute bottom-0 right-0">
            <span className="text-sm text-white-base/60">
              총 {posts.length}개의 포스트
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};
