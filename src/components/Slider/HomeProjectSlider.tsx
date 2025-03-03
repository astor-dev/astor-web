import { useEffect, useRef, useState } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { ProjectEntry } from "~types/project.type";
import FullImageProjectCard from "~components/Card/FullImageProjectCard";
import "swiper/css/effect-fade";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

const HomeProjectSlider = (props: { projects: ProjectEntry[] }) => {
  const { projects } = props;
  const swiperRef = useRef<SwiperRef>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projects.length > 0) {
      setIsLoading(false);
    }
  }, [projects]);

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
    <div className="h-full w-full">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        effect={"fade"}
        spaceBetween={30}
        slidesPerView={1}
        slidesPerGroup={1}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
          },
        }}
      >
        {projects?.map((project, index) => {
          return (
            <SwiperSlide key={project.id} virtualIndex={index}>
              <FullImageProjectCard key={project.id} {...project} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HomeProjectSlider;
