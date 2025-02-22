import { useRef } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import type { ProjectEntry } from "~types/project.type";
import ProjectCard from "~components/Card/ProjectCard";
const HomeProjectSlider = (props: { projects: ProjectEntry[] }) => {
  const { projects } = props;
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
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
        // slidesPerView={3}
        slidesPerGroup={1}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className="h-full w-full"
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
          1280: {
            slidesPerView: 3,
          },
        }}
      >
        {projects?.map((project, index) => {
          return (
            <SwiperSlide key={project.id} virtualIndex={index}>
              <ProjectCard key={project.id} {...project} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HomeProjectSlider;
