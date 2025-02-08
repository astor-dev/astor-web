import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SeriesCard from "~components/Card/SeriesCard";
import type { SeriesAndPosts } from "~utils/getPosts";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
      const progress = Math.min(Math.max(Math.abs(latest.x) / width, 0), 1);
      setScrollProgress(progress);
    },
    [width],
  );

  if (series.length === 0) return null;

  return (
    <section className="relative mb-12">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-black-accent">
            <span className="mr-2 inline-block rounded-lg bg-skin-accent/10 px-2 py-1 text-lg text-skin-accent">
              Series
            </span>
            시리즈
          </h2>
          <p className="text-sm text-black-muted">
            연재되는 글 모음을 확인해보세요
          </p>
        </div>

        {/* PC 스크롤 인디케이터 */}
        <div className="hidden items-center gap-4 rounded-full border border-gray-100 bg-white px-5 py-2 shadow-sm md:flex">
          <span className="text-sm font-medium text-black-muted">
            클릭 후 드래그
          </span>
          <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              style={{ scaleX: scrollProgress }}
              className="h-full origin-left bg-skin-accent"
            />
          </div>
        </div>
      </div>

      <div className="relative mb-12 md:mb-16">
        {/* 왼쪽 화살표 */}
        <div className="pointer-events-none absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 md:block">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-black-accent/60 backdrop-blur-sm transition-all ${
              scrollProgress === 0
                ? "opacity-20"
                : "opacity-80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            }`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </div>
        </div>

        {/* 오른쪽 화살표 */}
        <div className="pointer-events-none absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 md:block">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-black-accent/60 backdrop-blur-sm transition-all ${
              scrollProgress === 1
                ? "opacity-20"
                : "opacity-80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            }`}
          >
            <FaChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* 모바일 스크롤 인디케이터 */}
        <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm md:hidden">
          <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              style={{ scaleX: scrollProgress }}
              className="h-full origin-left bg-skin-accent"
            />
          </div>
          <span className="text-xs font-medium text-black-muted">스와이프</span>
        </div>

        <div className="overflow-hidden px-4">
          <motion.div
            ref={carouselRef}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            onUpdate={handleUpdate}
            className="flex h-fit cursor-grab select-none gap-6"
          >
            {series.map(({ series: seriesName, posts }, index) => (
              <motion.div
                key={index}
                className="w-[280px] shrink-0 sm:w-[300px] md:w-[350px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SeriesCard series={seriesName} posts={posts} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SeriesScrollSection;
