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

export default function FloatingIcons({
  icons,
  iconSizes,
}: {
  icons: { icon: React.ElementType; color: string }[];
  iconSizes: string[];
}) {
  const { width } = useViewport();

  // 브레이크포인트에 따른 아이콘 개수 설정
  const getCounter = () => {
    if (width < 640) return 12; // 모바일
    if (width < 1024) return 16; // 태블릿
    return 20; // 데스크탑 이상
  };

  const counter = getCounter();

  // useMemo를 사용하여 랜덤 아이콘 데이터 생성 (컴포넌트가 리렌더링될 때마다 새로운 아이콘 데이터 생성)
  const usedIcons = new Set();
  const iconsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < counter; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * icons.length);
      } while (usedIcons.has(randomIndex));
      usedIcons.add(randomIndex);
      const Icon = icons[randomIndex].icon;
      const color = icons[randomIndex].color;
      const size = iconSizes[Math.floor(Math.random() * iconSizes.length)];
      const position = generateRandomPosition(i, counter);
      const floatingAnimation = `animate-float-${Math.floor(
        Math.random() * 3,
      )}`;
      data.push({
        Icon,
        color,
        size,
        top: position.top,
        left: position.left,
        // floatingAnimation: "animate-float-2",
        floatingAnimation,
      });
    }
    return data;
  }, [icons, iconSizes, counter]);

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
          floatingAnimation={it.floatingAnimation}
          // 애니메이션 지연 시간 설정 (100ms 간격)
          delay={
            width < 640 ? index * 40 : width < 1024 ? index * 30 : index * 25
          }
        />
      ))}
    </>
  );
}
