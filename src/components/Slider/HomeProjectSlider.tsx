import { useEffect, useRef, useState } from "react";
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { ProjectEntry } from "~types/project.type";
import FullImageProjectCard from "~components/Card/FullImageProjectCard";
import "swiper/css/effect-fade";

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
    <div className="flex h-full w-full">
      <div className="relative h-full w-full">
        {/* 4:3 비율을 유지하는 컨테이너 */}{" "}
        <div className="aspect-[4/3] w-full">
          <Swiper
            ref={swiperRef}
            modules={[
              Navigation,
              Pagination,
              Autoplay,
              EffectFade,
              FreeMode,
              Mousewheel,
            ]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            effect={"fade"}
            spaceBetween={0}
            slidesPerView={1}
            slidesPerGroup={1}
            className="h-full"
            pagination={{
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
              },
            }}
            freeMode={false}
            mousewheel={{ enabled: true, forceToAxis: true }}
          >
            {projects?.map((project, index) => {
              return (
                <SwiperSlide
                  key={project.id}
                  virtualIndex={index}
                  className="h-full"
                >
                  <div className="h-full w-full">
                    <FullImageProjectCard key={project.id} {...project} />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeProjectSlider;
