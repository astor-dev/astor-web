import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import type { SeriesAndCount } from "~types/post.type";
export interface SeriesCardProps {
  series: SeriesAndCount;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series }) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = series.series.data.ogImage || "/default-series.jpg";
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
      window.location.href = `/blog/series/${encodeURIComponent(series.series.data.id)}`;
    }
  };

  return (
    <div className="group relative h-[250px] overflow-hidden bg-transparent md:h-[300px]">
      <motion.a
        href={`/blog/series/${encodeURIComponent(series.series.data.id)}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        className="relative block h-full w-full"
      >
        <ImageWithSkeleton
          className="absolute inset-0 h-full w-full object-cover md:relative md:h-[200px]"
          src={imageUrl}
          alt={series.series.data.name}
          onLoadComplete={handleImageLoad}
        />

        {/* 반투명 오버레이와 카드 내용 - 모바일용 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden">
          <div className="text-white absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-xl font-bold text-white-base">
              {isLoading ? <Skeleton width="50%" /> : series.series.data.name}
            </h2>
            <p className="mt-1 text-sm text-white-base/80">
              {isLoading ? (
                <Skeleton width="40%" />
              ) : (
                `${series.count}개의 포스트`
              )}
            </p>
          </div>
        </div>

        {/* 카드 내용 - 데스크톱용 */}
        <div className="hidden py-4 md:block">
          <h2 className="text-xl font-bold text-black-accent">
            {isLoading ? <Skeleton width="50%" /> : series.series.data.name}
          </h2>
          <p className="mt-1 text-sm text-black-base">
            {isLoading ? (
              <Skeleton width="40%" />
            ) : (
              `${series.count}개의 포스트`
            )}
          </p>
        </div>
      </motion.a>
    </div>
  );
};

export default SeriesCard;
