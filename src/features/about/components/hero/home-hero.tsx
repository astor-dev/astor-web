import ImageWithSkeleton from "~common/components/skeletons/image-with-skeleton";
import heroMilkyway from "~assets/images/space.jpg";
import LoadingSpinner from "~common/components/loadings/loading-spinner";
import { useState } from "react";

export default function HomeHero() {

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(true);

  function handleImageLoad() {
    setIsImageLoaded(true);
    setSpinnerVisible(false);
  }
  return (
    <section
      id="hero-section"
      className="relative flex min-h-[300px] w-full flex-col justify-center overflow-hidden bg-[#0a1929] md:min-h-[350px]"
    >
      <ImageWithSkeleton
        id="hero-img"
        src={heroMilkyway.src}
        alt="Hero 배경 이미지"
        className={`absolute inset-0 flex h-full w-full items-center justify-center object-cover ${
          isImageLoaded ? "" : "hidden"
        }`}
        onLoadComplete={handleImageLoad}
      />
      <div
          id="spinner"
          className="absolute inset-0 flex items-center justify-center bg-black"
          style={{ display: spinnerVisible ? "flex" : "none" }}
        >
          <LoadingSpinner className="h-full w-full" />
        </div>

      <div className="absolute inset-0 z-10 bg-black opacity-60"/>
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] px-12 md:px-16">
        <div className="flex-1">
          <h1 className="mb-3 font-sans text-4xl font-bold text-white-base md:text-5xl lg:text-6xl">
            hello, world!
          </h1>
          <p className="mb-4 font-sans text-sm text-gray-400 md:text-base">
            소프트웨어 개발자 astor, 김도훈의 개인 홈페이지
          </p>
          <a
            href="/about"
            className="group inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-500 bg-gray-800/30 px-3 py-1.5 text-xs font-medium text-gray-200 backdrop-blur-sm transition duration-200 hover:border-gray-400 hover:bg-gray-800/50 hover:text-white-base md:px-4 md:py-2 md:text-sm"
          >
            <span>소개 페이지</span>
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
