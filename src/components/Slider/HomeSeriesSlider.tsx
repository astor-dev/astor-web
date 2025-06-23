import { useEffect, useRef, useState } from "react";
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Mousewheel,
  Navigation,
} from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import FullImageSeriesCard from "~components/Card/FullImageSeriesCard";
import type { SeriesAndCount } from "~types/post.type";
import SliderNavButtons from "~components/Slider/SliderNavButtons";
import "swiper/css/effect-fade";

interface SliderOptions {
  mobile: {
    effect: "slide" | "fade";
    slidesPerView: number;
    spaceBetween: number;
  };
  desktop: {
    effect: "slide" | "fade";
    slidesPerView: number;
    spaceBetween: number;
  };
}

const MagazineCarousel = (props: {
  seriesList: SeriesAndCount[];
  options?: SliderOptions;
}) => {
  const { seriesList, options } = props;
  const swiperRef = useRef<SwiperRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 기본 옵션 설정
  const defaultOptions: SliderOptions = {
    mobile: {
      effect: "fade",
      slidesPerView: 1,
      spaceBetween: 0,
    },
    desktop: {
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

  const currentOptions = isMobile
    ? sliderOptions.mobile
    : sliderOptions.desktop;

  return (
    <div className="relative -mx-4 md:mx-0">
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
            }}
            fadeEffect={
              currentOptions.effect === "fade"
                ? {
                    crossFade: true,
                  }
                : undefined
            }
            centeredSlidesBounds={true}
            pagination={{ clickable: true }}
            className="h-full w-full overflow-hidden"
          >
            {seriesList.map((series, index) => (
              <SwiperSlide key={series.series.data.id} virtualIndex={index}>
                <FullImageSeriesCard series={series} />
              </SwiperSlide>
            ))}
          </Swiper>

          <SliderNavButtons onPrevClick={handlePrev} onNextClick={handleNext} />
        </div>
      )}
    </div>
  );
};

export default MagazineCarousel;
