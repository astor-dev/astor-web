import React from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import type { ProjectEntry } from "~/types/project.type";

/** HeroCard 스타일로 완전히 재구성한 컴포넌트 */
interface ProjectCardProps extends ProjectEntry {
  // 추가적으로 필요한 props가 있다면 여기에 선언
  // (기존 showInitialAnimation 등은 제거했습니다.)
}

const FullImageProjectCard = (props: ProjectCardProps) => {
  const { data } = props;
  const { imageUrl, projectName, companyName, shortDescription } = data;

  return (
    <div className="relative h-full w-full">
      <a href={`/projects/${projectName}`} className="block h-full w-full">
        {/* 이미지 컨테이너 (4:3 비율 유지) */}
        <div className="relative h-full w-full overflow-hidden">
          <ImageWithSkeleton
            src={imageUrl}
            alt={projectName}
            className="h-full w-full object-cover"
          />

          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* 프로젝트 정보 */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 lg:p-8">
          {/* 프로젝트명 */}
          <h3 className="line-clamp-1 text-xl font-bold text-white-base md:text-2xl">
            {projectName}
          </h3>

          {/* 회사명 및 설명 */}
          <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm text-white-base/90 md:text-base">
            {companyName} | {shortDescription}
          </p>
        </div>
      </a>
    </div>
  );
};

export default FullImageProjectCard;
