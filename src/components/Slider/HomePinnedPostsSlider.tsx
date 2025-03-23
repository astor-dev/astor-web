import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { PostEntry } from "~types/post.type";
import BlogPostCard from "~components/Card/BlogPostCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const MagazineCarousel = (
  props: { pinnedPosts: PostEntry[] } = { pinnedPosts: [] },
) => {
  const { pinnedPosts } = props;
  const swiperRef = useRef<SwiperRef>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pinnedPosts.length > 0) {
      setIsLoading(false);
    }
  }, [pinnedPosts]);

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
        <div className="grid h-[500px] w-full"></div>
      ) : (
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay]}
            loop={true}
            spaceBetween={30}
            slidesPerGroup={1}
            centeredSlidesBounds={true}
            grabCursor={true}
            pagination={{ clickable: true }}
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
            {pinnedPosts?.map((post, index) => (
              <SwiperSlide key={post.id} virtualIndex={index}>
                <BlogPostCard key={post.id} {...post} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            onClick={handlePrev}
            className="z-base absolute -left-10 top-1/2 z-30 hidden rounded-full bg-skin-fill p-6 text-3xl text-black-accent opacity-70 md:block"
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={handleNext}
            className="z-base absolute -right-10 top-1/2 z-30 hidden rounded-full bg-skin-fill p-6 text-3xl text-black-accent opacity-70 md:block"
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </div>
  );
};

export default MagazineCarousel;
