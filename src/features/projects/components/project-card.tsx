// ProjectCard.tsx
import React, { useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import type { ProjectEntry } from "~common/types/project.type";
import dayjs from "dayjs";
import ImageWithSkeleton from "~common/components/skeletons/image-with-skeleton";
import { useIntersectionObserver } from "~common/hooks/use-intersection-observer";

interface ProjectCardProps extends ProjectEntry {
  showInitialAnimation?: boolean;
}

const ProjectCard = (props: ProjectCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // 태그 영역 클릭 시 이벤트 중단
    if ((e.target as HTMLElement).closest(".tags-scroll")) {
      e.preventDefault();
      return;
    }

    // 데스크톱에서는 바로 이동
    if (window.matchMedia("(min-width: 768px)").matches) {
      return;
    }

    // 모바일에서 첫 터치시에는 이벤트 중단
    if (!isTouched) {
      e.preventDefault();
      setIsTouched(true);
      // 3초 후 터치 상태 초기화
      setTimeout(() => setIsTouched(false), 3000);
    }
  };

  // 프로젝트 기간을 포맷팅하는 함수
  const formatProjectPeriod = (startDate: string, endDate: string | null) => {
    const start = dayjs(startDate).format("YYYY.MM");
    if (!endDate) {
      return `${start} ~ 진행중`;
    }
    const end = dayjs(endDate).format("YYYY.MM");
    return `${start} ~ ${end}`;
  };

  return (
    <a
      href={`/projects/${props.id}`}
      className="group block"
      onClick={handleClick}
    >
      <article
        ref={cardRef}
        className={`relative h-full overflow-hidden bg-transparent ${
          props.showInitialAnimation
            ? "transition-all duration-700 ease-out"
            : ""
        } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} `}
      >
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] h-full w-full overflow-hidden">
            <ImageWithSkeleton
              src={props.data.imageUrl}
              alt={props.data.projectName}
              className="h-full w-full object-cover transition-transform duration-500"
              onLoadComplete={handleImageLoad}
            />
            <div
              className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/60 to-black/40 opacity-0 transition-all duration-300 md:group-hover:opacity-100 ${
                isTouched ? "opacity-100" : ""
              }`}
            >
              <div
                className={`p-4 text-center transition-opacity duration-300 ${isTouched ? "opacity-100" : "opacity-0 md:opacity-100"}`}
              >
                <p className="mb-2 text-base font-medium text-white-base lg:text-lg">
                  {isLoading ? <Skeleton /> : props.data.companyName}
                </p>
                <h3 className="text-xl font-bold text-white-base lg:text-2xl">
                  {isLoading ? <Skeleton /> : props.data.projectName}
                </h3>
                <p className="mt-2 text-sm text-white-base/80">
                  {isTouched ? "탭하여 자세히 보기" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[8rem] flex-col justify-between py-4">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium uppercase tracking-wider text-black-base">
            {isLoading ? <Skeleton count={2} /> : props.data.shortDescription}
          </p>

          <div className="space-y-2">
            <p className="text-xs text-black-muted">
              {isLoading ? (
                <Skeleton width={100} />
              ) : (
                formatProjectPeriod(
                  props.data.startedAt,
                  props.data.endedAt || null,
                )
              )}
            </p>

            <div className="tags-scroll relative -mx-4 px-4 lg:-mx-5 lg:px-5">
              <div className="hide-scrollbar flex overflow-x-scroll">
                {props.data.roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="mr-2 inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-skin-accent/10 px-2.5 py-0.5 text-xs font-medium text-skin-accent last:mr-0"
                  >
                    {isLoading ? <Skeleton width={40} height={16} /> : role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
};

export default ProjectCard;
