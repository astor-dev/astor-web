// components/Icon/FloatingIcons.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useViewport } from "../../hooks/UseViewport/UseViewport";
import FloatingObject from "./FloatingObject";
import { stacks } from "~constants/stacks";

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

export default function FloatingIcons() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  if (!isMounted) return null; // 한 번만 렌더링되도록 제한

  const icons = stacks.map(stack => ({
    icon: stack.icon,
    color: stack.color,
  }));

  const { width } = useViewport();
  // 브레이크포인트에 따른 아이콘 개수 설정
  const getCounter = () => {
    if (width < 640) return 16;
    return 20;
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
      const position = generateRandomPosition(i, counter);
      const randomValue = Math.floor(Math.random() * 3);
      const floatingAnimation = `animate-float-${randomValue}`;
      const size =
        randomValue === 0
          ? "h-5 w-5 sm:h-7 sm:w-7"
          : randomValue === 1
            ? "h-4 w-4 sm:h-6 sm:w-6"
            : "h-3 w-3 sm:h-5 sm:w-5";
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
  }, [icons, counter]);

  return (
    <>
      {iconsData.map((it, index) => (
        <FloatingObject
          key={index}
          icon={<it.Icon className={`bg-white-accent ${it.size}`} />}
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
