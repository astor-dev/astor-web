import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { stacks } from "~constants/stacks";
import { stackTypeEnum, type StackType } from "~types/stack.type";

import type { ProjectEntry } from "~types/project.type";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import {
  Autoplay,
  FreeMode,
  Mousewheel,
  Navigation,
  Grid,
  Pagination,
} from "swiper/modules";

// import "swiper/css/pagination";
import StackItem from "~components/Stack/StackItem";

interface StackSliderProps {
  stackIds?: number[];
  defaultType?: StackType | "all";
  enableFeatured?: boolean;
  relatedProjects?: Record<number, ProjectEntry[]>;
}

// 스택 타입 순서 정의
const stackTypeOrder: Record<StackType, number> = {
  [stackTypeEnum.Enum.Frontend]: 1,
  [stackTypeEnum.Enum.Backend]: 2,
  [stackTypeEnum.Enum.DevOps]: 3,
};

const StackSlider: React.FC<StackSliderProps> = ({
  stackIds,
  defaultType = "all",
  enableFeatured = false,
  relatedProjects = {},
}) => {
  const [selectedType, setSelectedType] = useState<StackType | "all">(
    defaultType,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperRef>(null);

  const availableStacks = stacks
    .filter(stack => (stackIds ? stackIds.includes(stack.id) : true))
    .sort((a, b) => {
      if (enableFeatured) {
        if (a.superFeatured !== b.superFeatured) {
          return b.superFeatured ? 1 : -1;
        }
        if (a.featured !== b.featured) {
          return b.featured ? 1 : -1;
        }
      }
      if (a.stackType !== b.stackType) {
        return (
          (stackTypeOrder[a.stackType] ?? Infinity) -
          (stackTypeOrder[b.stackType] ?? Infinity)
        );
      }
      return a.name.localeCompare(b.name);
    });

  // 사용 가능한 스택 타입도 정의된 순서대로 정렬
  const availableTypes = [
    "all" as const,
    ...Array.from(new Set(availableStacks.map(stack => stack.stackType))).sort(
      (a, b) =>
        (stackTypeOrder[a] ?? Infinity) - (stackTypeOrder[b] ?? Infinity),
    ),
  ];

  const filteredStacks = availableStacks.filter(stack =>
    selectedType === "all" ? true : stack.stackType === selectedType,
  );

  useEffect(() => {
    if (selectedType !== defaultType) {
      setSelectedType(defaultType);
    }
  }, [defaultType]);

  // Swiper 제어 함수
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
    <div ref={containerRef} className="relative w-full">
      {/* 필터 버튼 */}
      <div
        className={`relative mb-6 flex max-h-[120px] flex-wrap justify-center gap-2 overflow-y-auto px-1 py-2 duration-300`}
      >
        {availableTypes.map(type => (
          <button
            type="button"
            key={type}
            onClick={() => setSelectedType(type)}
            className={`z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              selectedType === type
                ? "bg-skin-accent text-white-base shadow-md"
                : "bg-skin-card hover:bg-skin-card-muted text-skin-base"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* 스택 슬라이더 (4행 그리드) */}
      <div className="relative">
        {filteredStacks.length > 0 ? (
          <Swiper
            ref={swiperRef}
            modules={[
              Grid,
              Navigation,
              Autoplay,
              Pagination,
              FreeMode,
              Mousewheel,
            ]}
            grid={{
              rows: 4,
              fill: "row",
            }}
            // autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={0}
            slidesPerGroup={1}
            grabCursor={true}
            freeMode={false}
            mousewheel={{ enabled: true, forceToAxis: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              enabled: true,
              type: "progressbar",
            }}
            className="stack-progress-slider h-[300px] w-full pb-5"
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 0,
                grid: { rows: 4 },
              },
              640: {
                // sm
                slidesPerView: 3,
                spaceBetween: 0,
                grid: { rows: 4 },
              },
              768: {
                // md
                slidesPerView: 4,
                spaceBetween: 0,
                navigation: {
                  enabled: true,
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                },
                grid: { rows: 4, fill: "row" },
              },
              1024: {
                // lg
                slidesPerView: 5,
                spaceBetween: 0,
                grid: { rows: 4, fill: "row" },
              },
            }}
          >
            <AnimatePresence mode="sync">
              {filteredStacks.map(stack => (
                <SwiperSlide key={stack.id}>
                  <StackItem
                    stack={stack}
                    showFeatured={enableFeatured}
                    relatedProjects={relatedProjects[stack.id] || []}
                  />
                </SwiperSlide>
              ))}
            </AnimatePresence>
          </Swiper>
        ) : (
          <p className="text-center text-sm text-black-muted">
            해당하는 스택이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default StackSlider;
