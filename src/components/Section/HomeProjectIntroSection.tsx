import React from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import bannerImage from "~assets/images/project-banner.png";
import { IoArrowForward } from "react-icons/io5";

const HomeProjectIntroSection = () => {
  return (
    <div className="flex h-full w-full flex-col bg-gray-100 px-[5dvw] py-6">
      {/* 헤더 텍스트 영역 */}
      <div className="mb-4 flex flex-col">
        <h1 className="text-left text-2xl font-bold text-black-accent md:text-3xl lg:text-4xl">
          프로젝트 모음
        </h1>
        <p className="mt-2 text-left text-base text-black-base md:text-lg">
          Astor가 진행한 프로젝트를 확인해 보세요!
        </p>
      </div>

      {/* 이미지 영역 (화면 비율에 맞게 자동 조정) */}
      <div className="relative flex-1 overflow-hidden">
        <div className="aspect-[4/3] h-auto w-full">
          <ImageWithSkeleton
            src={bannerImage.src}
            alt="프로젝트 일러스트 이미지"
            className="h-full w-full object-contain"
          />
        </div>

        {/* CTA 버튼 (이미지 위에 오버레이) */}
        <div className="absolute bottom-4 right-4 z-10 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8">
          <a
            href="/projects"
            className="group flex items-center gap-2 rounded-lg bg-skin-accent px-4 py-2 text-sm text-white-base shadow-lg transition-all hover:bg-skin-accent/90 active:scale-95 md:px-6 md:py-3 md:text-base"
          >
            <span className="font-medium">프로젝트 보기</span>
            <IoArrowForward className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeProjectIntroSection;
