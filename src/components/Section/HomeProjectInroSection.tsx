import React from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import bannerImage from "~assets/images/project-banner.png";

const HomeProjectIntroSection = () => {
  return (
    <section className="flex h-[66vh] w-full items-center justify-center bg-gray-100 px-[5vw] py-[10vh]">
      <div className="w-full max-w-2xl">
        {/* 텍스트: 왼쪽 정렬 */}
        <h1 className="mb-4 text-left text-4xl font-bold text-black-accent md:text-5xl">
          프로젝트 모음
        </h1>
        <p className="mb-6 text-left text-lg text-black-base md:text-xl">
          Astor가 진행한 프로젝트를 확인해 보세요!
        </p>

        {/* 이미지: 가로 중앙 정렬 (mx-auto) */}
        <div className="mx-auto">
          <ImageWithSkeleton
            src={bannerImage.src}
            alt="일러스트 이미지"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeProjectIntroSection;
