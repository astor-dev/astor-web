import { useEffect, useRef, useState } from "react";
import { Autoplay, FreeMode, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { PostEntry } from "~types/post.type";
import BlogPostCard from "~components/Card/BlogPostCard";
import SliderNavButtons from "~components/Slider/SliderNavButtons";

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
    <div className="relative -mx-4 md:mx-0">
      {isLoading ? (
        <div className="grid h-[300px] w-full md:h-[500px]"></div>
      ) : (
        <div className="swiper-container-wrapper group relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, FreeMode, Mousewheel]}
            loop={true}
            spaceBetween={30}
            slidesPerGroup={1}
            centeredSlidesBounds={true}
            grabCursor={true}
            freeMode={{
              enabled: pinnedPosts.length >= 5 ? true : false,
            }}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
            }}
            pagination={{ clickable: true }}
            className="h-full w-full overflow-hidden"
            breakpoints={{
              0: {
                slidesPerView: 1.2,
                slidesOffsetBefore: 16,
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

          <SliderNavButtons onPrevClick={handlePrev} onNextClick={handleNext} />
        </div>
      )}
    </div>
  );
};

export default MagazineCarousel;
