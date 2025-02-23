import { useRef } from "react";
import { Autoplay, Grid, Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { Tag } from "~types/post.type";
import TagCard from "~components/Card/TagCard";

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
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay, Grid]}
        // autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={false}
        spaceBetween={30}
        slidesPerGroup={1}
        grid={{
          fill: "row",
          rows: 2,
        }}
        grabCursor={true}
        centeredSlidesBounds={true}
        pagination={{
          enabled: true,
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
          },
        }}
        navigation={{ nextEl: null, prevEl: null }}
        // scrollbar={{ draggable: true }}
        className="h-full w-full"
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
    </div>
  );
};

export default MagazineCarousel;
