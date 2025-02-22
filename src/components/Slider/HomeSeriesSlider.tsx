import { useRef } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { Series } from "~types/post.type";
import FullImageSeriesCard from "~components/Card/FullImageSeriesCard";

const MagazineCarousel = (props: { seriesList: Series[] }) => {
  const { seriesList } = props;
  const swiperRef = useRef<SwiperRef>(null);

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
    <div className="h-508 relative">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
        slidesPerGroup={1}
        grabCursor={true}
        centeredSlidesBounds={true}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className="h-full w-full"
        breakpoints={{
          0: {
            slidesPerView: 1.2,
          },
          640: {
            //sm
            slidesPerView: 2,
          },
          768: {
            //md
            slidesPerView: 3,
            navigation: {
              enabled: true,
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          },
        }}
      >
        {seriesList?.map((series, index) => {
          return (
            <SwiperSlide key={series.series} virtualIndex={index}>
              <FullImageSeriesCard key={series.series} {...series} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MagazineCarousel;
