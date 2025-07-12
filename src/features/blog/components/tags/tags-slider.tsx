import { useRef } from "react";
import {
  Autoplay,
  FreeMode,
  Grid,
  Mousewheel,
  Navigation,
  Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import TagCard from "~features/blog/components/tags/tag-card";
import SliderNavButtons from "~common/components/buttons/slider-nav-buttons";
import type { Tag } from "~common/types/post.type";

const MagazineCarousel = (props: { tagList: Tag[] }) => {
  const { tagList } = props;
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
    <div className="relative">
      <div className="swiper-container-wrapper group relative">
        <Swiper
          ref={swiperRef}
          modules={[
            Navigation,
            Autoplay,
            Grid,
            FreeMode,
            Mousewheel,
            Scrollbar,
          ]}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={false}
          spaceBetween={30}
          slidesPerGroup={1}
          grid={{
            fill: "row",
            rows: 2,
          }}
          grabCursor={true}
          freeMode={{
            enabled: true,
          }}
          mousewheel={{ enabled: true, forceToAxis: true }}
          centeredSlidesBounds={true}
          pagination={{
            enabled: true,
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
            },
          }}
          navigation={{ nextEl: null, prevEl: null }}
          // scrollbar={{ draggable: true, hide: true }}
          className="h-full w-full overflow-hidden"
          breakpoints={{
            0: {
              slidesPerView: 1.4,
            },
            640: {
              //sm
              slidesPerView: 2.4,
            },
            768: {
              //md
              slidesPerView: 3.4,
            },
          }}
        >
          {tagList?.map((tag, index) => {
            return (
              <SwiperSlide key={tag.tag} virtualIndex={index}>
                <TagCard key={tag.tag} {...tag} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <SliderNavButtons onPrevClick={handlePrev} onNextClick={handleNext} />
      </div>
    </div>
  );
};

export default MagazineCarousel;
