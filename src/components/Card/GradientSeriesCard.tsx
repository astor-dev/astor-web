import { FaBookmark } from "react-icons/fa";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import { useRef, useCallback } from "react";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import { loadSlim } from "tsparticles-slim";
import { Particles as ReactParticles } from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import type { PostEntry } from "~types/post.type";

export const GradientSeriesCard = ({
  series,
  posts,
}: {
  series: string;
  posts: PostEntry[];
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);
  // coverImage는 썸네일 용도로만 사용합니다.
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
        className="group relative block h-full overflow-hidden rounded-2xl bg-gradient-to-br from-skin-accent/20 via-skin-secondary/30 to-skin-accent/10 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* 파티클 효과 */}
        <ReactParticles
          id={`particles-${series}`}
          className="pointer-events-none absolute inset-0 z-10"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            fpsLimit: 30,
            particles: {
              groups: {
                stars: {
                  number: { value: 15 },
                  size: { value: { min: 1, max: 2 } },
                  opacity: { value: 0.6 },
                  color: { value: ["#5B5FB0", "#8589CC"] },
                },
                stardust: {
                  number: { value: 30 },
                  size: { value: { min: 0.5, max: 1 } },
                  opacity: { value: 0.3 },
                  color: { value: ["#7C7CBF", "#9CA0D9"] },
                },
                glow: {
                  number: { value: 6 },
                  size: { value: { min: 2, max: 3 } },
                  opacity: { value: 0.15 },
                  color: { value: ["#5B5FB0", "#8589CC", "#9CA0D9"] },
                },
              },
              move: {
                enable: true,
                direction: "none",
                random: true,
                speed: 0.2,
                outModes: { default: "bounce" },
                trail: {
                  enable: true,
                  length: 4,
                  fillColor: "transparent",
                },
              },
              opacity: {
                animation: {
                  enable: true,
                  speed: 0.2,
                  minimumValue: 0.1,
                  sync: false,
                },
              },
              size: {
                random: true,
                animation: {
                  enable: true,
                  speed: 0.3,
                  minimumValue: 0.5,
                  sync: false,
                },
              },
              twinkle: {
                particles: {
                  enable: true,
                  frequency: 0.03,
                  opacity: 0.5,
                },
              },
              blur: {
                enable: true,
                strength: 0.5,
              },
            },
            detectRetina: true,
          }}
        />

        {/* 컨텐츠 */}
        <div className="relative z-20 flex h-full flex-col">
          <div className="mb-6 flex items-center gap-2">
            <FaBookmark className="h-5 w-5 text-skin-accent" />
            <h3 className="text-xl font-bold text-black-accent md:text-2xl dark:text-black-base">
              {series}
            </h3>
          </div>

          {/* 썸네일과 최근 포스트 목록 */}
          <div className="flex flex-col gap-4">
            {/* 썸네일 이미지 (원형) */}
            <div className="flex items-center gap-4">
              <div className="border-white-accent h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border">
                <ImageWithSkeleton
                  src={coverImage as string}
                  alt={series}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black-base dark:text-black-muted">
                  {series} 시리즈의 대표 이미지
                </p>
              </div>
            </div>
            {/* 최근 포스트 목록 */}
            <div className="space-y-3">
              {posts.slice(0, 3).map((post: PostEntry, index: number) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-skin-accent/10 text-xs font-medium text-skin-accent">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h4 className="line-clamp-1 text-sm font-medium text-black-base/80 transition-colors duration-300 group-hover:text-black-accent dark:text-black-muted dark:group-hover:text-black-base">
                    {post.data.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* 포스트 카운트 */}
          <div className="mt-auto self-end">
            <span className="text-sm text-black-muted dark:text-black-muted">
              총 {posts.length}개의 포스트
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};
