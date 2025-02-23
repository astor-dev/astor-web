import { useRef } from "react";
import { Autoplay, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { PostEntry, Series } from "~types/post.type";
import FullImageSeriesCard from "~components/Card/FullImageSeriesCard";
import BlogPostCard from "~components/Card/BlogPostCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const MagazineCarousel = (props: { pinnedPosts: PostEntry[] }) => {
  const { pinnedPosts } = props;
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
        modules={[Navigation, Autoplay]}
        // autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
        slidesPerGroup={1}
        centeredSlidesBounds={true}
        grabCursor={true}
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
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
              nextEl: null,
              prevEl: null,
            },
          },
        }}
      >
        {pinnedPosts?.map((post, index) => {
          return (
            <SwiperSlide key={post.id} virtualIndex={index}>
              <BlogPostCard key={post.id} {...post} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        onClick={handlePrev}
        className="z-base absolute -left-10 top-1/2 z-30 rounded-full bg-skin-fill p-6 text-3xl text-black-accent opacity-70"
      >
        <IoIosArrowBack />
      </button>
      <button
        onClick={handleNext}
        className="z-base absolute -right-10 top-1/2 z-30 rounded-full bg-skin-fill p-6 text-3xl text-black-accent opacity-70"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default MagazineCarousel;
