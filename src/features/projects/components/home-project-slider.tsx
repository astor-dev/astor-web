import { useEffect, useRef, useState } from "react";
import {
  Autoplay,
  EffectFade,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { ProjectEntry } from "~common/types/project.type";
import FullImageProjectCard from "~features/projects/components/full-image-project-card";
import "swiper/css/effect-fade";
import SliderNavButtons from "~common/components/buttons/slider-nav-buttons";

const HomeProjectSlider = (props: { projects: ProjectEntry[] }) => {
  const { projects } = props;
  const swiperRef = useRef<SwiperRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };
  return (
    <div className="swiper-container-wrapper group relative -mx-4 flex h-[300px] w-[calc(100%+32px)] sm:mx-0 sm:h-[470px] sm:w-full">
      {/* 숫자 페이지네이션 (sm 이상에서만) - 좌측 하단 */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:block">
        <div className="rounded-lg border border-white/20 bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-sm font-medium text-white-base drop-shadow-sm">
            {currentSlide + 1} / {projects.length}
          </span>
        </div>
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, EffectFade, Mousewheel]}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        loop={true}
        effect={"fade"}
        spaceBetween={0}
        slidesPerView={1}
        slidesPerGroup={1}
        className="h-full"
        pagination={
          isMobile
            ? {
                clickable: true,
                renderBullet: (index, className) => {
                  return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
                },
              }
            : false
        }
        mousewheel={{ enabled: true, forceToAxis: true, thresholdDelta: 10 }}
        onSlideChange={swiper => {
          setCurrentSlide(swiper.realIndex);
        }}
      >
        {projects?.map((project, index) => {
          return (
            <SwiperSlide
              key={project.id}
              virtualIndex={index}
              className="h-full"
            >
              <div className="h-full w-full">
                <FullImageProjectCard key={project.id} {...project} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <SliderNavButtons onPrevClick={handlePrev} onNextClick={handleNext} />
    </div>
  );
};

export default HomeProjectSlider;
