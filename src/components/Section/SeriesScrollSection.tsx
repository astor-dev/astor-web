import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SeriesCard from "~components/Card/SeriesCard";
import type { SeriesAndPosts } from "~utils/getPosts";

const SeriesScrollSection = ({ series }: { series: Array<SeriesAndPosts> }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth,
      );
    }
  }, [series]);

  const handleUpdate = useCallback(
    (latest: { x: number }) => {
      // transform 값을 기반으로 정확한 스크롤 진행도 계산
      const progress = Math.min(Math.max(Math.abs(latest.x) / width, 0), 1);
      setScrollProgress(progress);
    },
    [width],
  );

  // 인디케이터의 활성화 여부를 결정하는 함수
  const isIndicatorActive = (index: number) => {
    const threshold = 1 / 2; // 인디케이터 개수 - 1
    return scrollProgress >= index * threshold;
  };

  return (
    <>
      {series.length > 0 && (
        <section className="relative mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black-accent">📚 시리즈</h2>
            {/* PC 스크롤 인디케이터 */}
            <div className="hidden items-center gap-2 text-sm text-gray-500 md:flex">
              <span>스크롤하여 더보기</span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      isIndicatorActive(i) ? "bg-skin-accent" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative mb-12 md:mb-16">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />

            {/* 모바일 스크롤 인디케이터 */}
            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 md:hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    isIndicatorActive(i) ? "bg-skin-accent" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <div className="overflow-x-hidden">
              <motion.div
                ref={carouselRef}
                drag="x"
                dragConstraints={{ right: 0, left: -width }}
                onUpdate={handleUpdate}
                className="flex cursor-grab select-none snap-x snap-mandatory gap-4 pb-4"
              >
                {series.map(({ series: seriesName, posts }, index) => (
                  <div
                    key={index}
                    className="w-[300px] shrink-0 snap-start md:w-[350px]"
                  >
                    <SeriesCard series={seriesName} posts={posts} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SeriesScrollSection;
