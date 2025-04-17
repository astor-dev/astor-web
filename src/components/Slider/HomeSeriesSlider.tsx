import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Autoplay, FreeMode, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import FullImageSeriesCard from "~components/Card/FullImageSeriesCard";
import type { SeriesAndCount } from "~types/post.type";
import SliderNavButtons from "~components/Slider/SliderNavButtons";

const MagazineCarousel = (props: { seriesList: SeriesAndCount[] }) => {
  const { seriesList } = props;
  const swiperRef = useRef<SwiperRef>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (seriesList.length > 0) {
      setIsLoading(false);
    }
  }, [seriesList]);

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
    <div className="relative">
      {isLoading ? (
        <div className="grid h-[300px] w-full grid-cols-3 gap-4"></div>
      ) : (
        <div className="swiper-container-wrapper group relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, FreeMode, Mousewheel]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={30}
            slidesPerGroup={1}
            grabCursor={true}
            freeMode={{
              enabled: seriesList.length >= 6 ? true : false,
            }}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
            }}
            centeredSlidesBounds={true}
            pagination={{ clickable: true }}
            className="h-full w-full overflow-hidden"
            breakpoints={{
              0: { slidesPerView: 1.2 },
              640: { slidesPerView: 2.2 },
              768: {
                slidesPerView: 3.2,
                navigation: {
                  enabled: false,
                  nextEl: null,
                  prevEl: null,
                },
              },
            }}
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
