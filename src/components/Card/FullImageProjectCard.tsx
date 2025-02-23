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
    <div className={`relative h-[66vh] w-full flex-col md:aspect-square`}>
      <a href={`/projects/${projectName}`}>
        {/* 이미지 */}
        <ImageWithSkeleton
          src={imageUrl}
          alt={projectName}
          className="rounded-12 h-full w-full cursor-pointer object-cover"
        />
        {/* 그라데이션 Overlay (상단-좌측-하단 투명) */}
        {/* <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black via-transparent to-transparent opacity-80" /> */}

        <div className="absolute bottom-0 left-0 w-full pb-14 pl-4 pt-4 md:pb-24 md:pl-14">
          <div className="absolute inset-0 z-0 h-full w-full bg-black opacity-60" />
          {/* <h4 className="text-18 font-500 text-white mb-4 opacity-70">
          에디터 큐레이션
        </h4> */}
          {/* 둘째 줄(프로젝트명) */}
          <div className="line-clamp-1 flex flex-col text-lg font-bold text-white-base opacity-90 md:text-2xl">
            <span>{projectName}</span>
          </div>
          {/* 셋째 줄(회사명 | 짧은 설명 등) */}
          <div className="line-clamp-2 flex min-h-[3rem] flex-col gap-1 text-base text-white-base opacity-80 md:min-h-[3.75rem] md:text-lg">
            {/* 예: "회사명 | 짧은 설명" 형태 */}
            <span>
              {companyName} | {shortDescription}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default FullImageProjectCard;
