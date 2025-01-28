// components/Icon/FloatingIcons.jsx
import React, { useMemo } from "react";
import { useViewport } from "../../hooks/UseViewport/UseViewport";
import FloatingObject from "./FloatingObject";

// 랜덤한 각도와 반지름을 생성하는 유틸리티 함수
const generateRandomPosition = (
  index: number,
  total: number,
  radiusRange: [number, number] = [10, 40],
): { top: string; left: string } => {
  const angle =
    (index / total) * 2 * Math.PI + Math.random() * ((2 * Math.PI) / total);
  const radius =
    Math.random() * (radiusRange[1] - radiusRange[0]) + radiusRange[0];
  const top = 50 + radius * Math.sin(angle);
  const left = 50 + radius * Math.cos(angle);
  return {
    top: `${top}%`,
    left: `${left}%`,
  };
};

// 배열을 균등하게 분배하는 함수
const distributeEvenly = <T,>(array: T[], count: number): T[] => {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor((i * array.length) / count);
    result.push(array[index]);
  }
  return result;
};

export default function FloatingIcons({
  iconTypes,
  iconColors,
  iconSizes,
}: {
  iconTypes: React.ElementType[];
  iconColors: string[];
  iconSizes: string[];
}) {
  const { width } = useViewport();

  // 브레이크포인트에 따른 아이콘 개수 설정
  const getCounter = () => {
    if (width < 640) return 8; // 모바일
    if (width < 1024) return 12; // 태블릿
    return 16; // 데스크탑 이상
  };

  const counter = getCounter();

  const iconsData = useMemo(() => {
    // 아이콘 타입을 균등하게 분배
    const distributedIcons = distributeEvenly(iconTypes, counter);

    // 색상과 크기도 균등하게 분배
    const distributedColors = distributeEvenly(iconColors, counter);
    const distributedSizes = distributeEvenly(iconSizes, counter);

    // 분배된 값들을 섞어서 약간의 랜덤성 추가
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledColors = shuffleArray(distributedColors);
    const shuffledSizes = shuffleArray(distributedSizes);

    const data = [];
    for (let i = 0; i < counter; i++) {
      const position = generateRandomPosition(i, counter);
      data.push({
        Icon: distributedIcons[i],
        color: shuffledColors[i],
        size: shuffledSizes[i],
        top: position.top,
        left: position.left,
      });
    }
    return data;
  }, [iconTypes, iconColors, iconSizes, counter]);

  return (
    <>
      {iconsData.map((it, index) => (
        <FloatingObject
          key={index}
          icon={<it.Icon />}
          size={it.size}
          color={it.color}
          top={it.top}
          left={it.left}
          // floating 애니메이션 중 하나를 랜덤하게 할당
          animation={`animate-floating-${index % 3}`}
          // 애니메이션 지연 시간 설정 (40ms 간격)
          delay={index * 40}
        />
      ))}
    </>
  );
}
