import React from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import bannerImage from "~assets/images/project-banner.png";

const HomeProjectIntroSection = () => {
  return (
    <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-gray-100 px-[5dvw] py-[5dvh] md:h-[600px]">
      <div className="flex h-full w-full flex-col">
        {/* 텍스트: 왼쪽 정렬 */}
        <div className="mb-10 flex flex-col">
          <h1 className="text-left text-4xl font-bold text-black-accent">
            프로젝트 모음
          </h1>
          <p className="text-left text-lg text-black-base">
            Astor가 진행한 프로젝트를 확인해 보세요!
          </p>
        </div>
        {/* 이미지: 가로 중앙 정렬 */}
        <div className="relative h-full w-full overflow-hidden">
          <ImageWithSkeleton
            src={bannerImage.src}
            alt="일러스트 이미지"
            className="absolute h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeProjectIntroSection;
