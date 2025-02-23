import React from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import bannerImage from "~assets/images/project-banner.png";

const HomeProjectIntroSection = () => {
  return (
    <section className="relative flex h-[66vh] w-full items-center justify-center overflow-hidden bg-gray-100 px-[5vw] py-[5vh]">
      <div className="flex h-full min-h-0 w-full flex-col">
        {/* 텍스트: 왼쪽 정렬 */}
        <h1 className="text-left text-4xl font-bold text-black-accent">
          프로젝트 모음
        </h1>
        <p className="text-left text-lg text-black-base">
          Astor가 진행한 프로젝트를 확인해 보세요!
        </p>

        {/* 이미지: 가로 중앙 정렬 */}
        <div className="relative h-[40vh] w-full overflow-hidden">
          <ImageWithSkeleton
            src={bannerImage.src}
            alt="일러스트 이미지"
            className="absolute h-full min-w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeProjectIntroSection;
