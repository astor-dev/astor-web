import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
export interface SeriesCardProps {
  series: string;
  count: number;
  ogImage?: string;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, count, ogImage }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (series.length > 0) {
      setIsLoading(false);
    }
  }, [series]);

  const imageUrl = ogImage || "/default-series.jpg";
  // pointer 시작 위치 저장
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // 클릭 여부를 판단할 플래그
  const isClick = useRef<boolean>(true);

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    // 무조건 기본 이벤트 막기
    e.preventDefault();
    startPos.current = { x: e.clientX, y: e.clientY };
    isClick.current = true;
  };

  const handleImageLoad = () => {
    console.log("onLoadComplete!!");
    setIsLoading(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const threshold = 5; // 임계치 (필요에 따라 조정)
    if (distance > threshold) {
      isClick.current = false;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 무조건 기본 이벤트 막음
    e.preventDefault();
    if (isClick.current) {
      // 클릭으로 판단되면 수동으로 링크 이동 처리
      window.location.href = `/blog/series/${encodeURIComponent(series)}`;
    }
  };

  return (
    <div className="group relative h-[250px] overflow-hidden bg-transparent md:h-[300px]">
      <motion.a
        href={`/blog/series/${encodeURIComponent(series)}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
      >
        {/* 이미지 영역 */}
        <ImageWithSkeleton
          className="h-[150px] w-full bg-cover bg-center md:h-[200px]"
          src={imageUrl}
          alt={series}
        />
        {/* 카드 내용 */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-black-accent">
            {isLoading ? <Skeleton className="w-full" /> : series}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {isLoading ? (
              <Skeleton className="w-full" />
            ) : (
              `${count}개의 포스트`
            )}
          </p>
        </div>
      </motion.a>
    </div>
  );
};

export default SeriesCard;
