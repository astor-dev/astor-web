import { useEffect, useRef, useState } from "react";
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Mousewheel,
  Navigation,
} from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import FullImageSeriesCard from "~features/blog/components/series/full-image-series-card";
import type { SeriesAndCount } from "~common/types/post.type";
import SliderNavButtons from "~common/components/buttons/slider-nav-buttons";
import "swiper/css/effect-fade";

interface SliderOptions {
  mobile: {
    effect: "slide" | "fade";
    slidesPerView: number;
    spaceBetween: number;
  };
  sm: {
    effect: "slide" | "fade";
    slidesPerView: number;
    spaceBetween: number;
  };
  md: {
    effect: "slide" | "fade";
    slidesPerView: number;
    spaceBetween: number;
  };
  lg: {
    effect: "slide" | "fade";
    slidesPerView: number;
    spaceBetween: number;
  };
  xl: {
    effect: "slide" | "fade";
    slidesPerView: number;
    spaceBetween: number;
  };
}

const SeriesSlider = (props: {
  seriesList: SeriesAndCount[];
  options?: SliderOptions;
}) => {
  const { seriesList, options } = props;
  const swiperRef = useRef<SwiperRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [breakpoint, setBreakpoint] = useState<"mobile" | "sm" | "md" | "lg" | "xl">("mobile");
  const [currentSlide, setCurrentSlide] = useState(1);

  // 기본 옵션 설정
  const defaultOptions: SliderOptions = {
    mobile: {
      effect: "fade",
      slidesPerView: 1,
      spaceBetween: 30,
    },
    sm: {
      effect: "slide",
      slidesPerView: 1.6,
      spaceBetween: 30,
    },
    md: {
      effect: "slide",
      slidesPerView: 2.4,
      spaceBetween: 30,
    },
    lg: {
      effect: "slide",
      slidesPerView: 2.8,
      spaceBetween: 30,
    },
    xl: {
      effect: "slide",
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
  };

  const sliderOptions = options || defaultOptions;

  useEffect(() => {
    if (seriesList.length > 0) {
      setIsLoading(false);
    }
  }, [seriesList]);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint("mobile");
      } else if (width < 768) {
        setBreakpoint("sm");
      } else if (width < 1024) {
        setBreakpoint("md");
      } else if (width < 1280) {
        setBreakpoint("lg");
      } else {
        setBreakpoint("xl");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    
    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
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

  const currentOptions = sliderOptions[breakpoint];

  return (
    <div className="relative">
      {isLoading ? (
        <div className="grid h-[300px] w-full grid-cols-3 gap-4"></div>
      ) : (
        <div className="swiper-container-wrapper group relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, EffectFade, FreeMode, Mousewheel]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            effect={currentOptions.effect}
            spaceBetween={currentOptions.spaceBetween}
            slidesPerView={currentOptions.slidesPerView}
            slidesPerGroup={1}
            grabCursor={true}
            freeMode={false}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
              sensitivity: 0.4,
              thresholdDelta: 10,
            }}
            fadeEffect={
              currentOptions.effect === "fade"
                ? {
                    crossFade: true,
                  }
                : undefined
            }
            centeredSlidesBounds={true}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.realIndex + 1);
            }}
            className="h-full w-full overflow-hidden"
          >
            {seriesList.map((series, index) => (
              <SwiperSlide key={series.series.data.id} virtualIndex={index}>
                <FullImageSeriesCard series={series} />
              </SwiperSlide>
            ))}
          </Swiper>

          <SliderNavButtons onPrevClick={handlePrev} onNextClick={handleNext} />
          
          {/* 슬라이드 카운터 */}
          <div className="absolute right-2 top-2 z-10 min-w-[50px] rounded-full bg-black/60 py-2 text-center text-xs text-white-accent tabular-nums sm:hidden">
            {currentSlide} / {seriesList.length}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default SeriesSlider;
