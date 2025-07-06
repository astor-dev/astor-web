import { useEffect, useRef, useState } from "react";
import {
  Autoplay,
  EffectFade,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { ProjectEntry } from "~types/project.type";
import FullImageProjectCard from "~components/Card/FullImageProjectCard";
import "swiper/css/effect-fade";
import SliderNavButtons from "~components/Slider/SliderNavButtons";

const HomeProjectSlider = (props: { projects: ProjectEntry[] }) => {
  const { projects } = props;
  const swiperRef = useRef<SwiperRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (projects.length > 0) {
      setIsLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
    <div className="swiper-container-wrapper group relative -mx-4 flex h-[300px] w-[calc(100%+32px)] md:mx-0 md:h-[400px] md:w-full">
      {/* 숫자 페이지네이션 (md 이상에서만) - 좌측 하단 */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:block">
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
