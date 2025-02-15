// components/Icon/FloatingIcons.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
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

export default function FloatingIcons(props: { isVisible: boolean }) {
  const [isVisible, setIsVisible] = useState(props.isVisible);
  // animationSeed를 useRef로 관리하여 초기값을 고정합니다.
  const animationSeed = useRef(Date.now());

  useEffect(() => {
    setIsVisible(props.isVisible);
    // isVisible이 true로 전환되어도 animationSeed는 업데이트하지 않습니다.
  }, [props.isVisible]);

  const icons = useMemo(
    () => stacks.map(stack => ({ icon: stack.icon, color: stack.color })),
    [],
  );

  const { width } = useViewport();
  // 브레이크포인트에 따른 아이콘 개수 설정
  const getCounter = () => {
    if (width < 640) return 16;
    return 20;
  };

  const counter = getCounter();

  // useMemo를 사용하여 랜덤 아이콘 데이터 생성
  const iconsData = useMemo(() => {
    const usedIcons = new Set();
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
      });
    }
    return data;
  }, [icons, counter]);

  return (
    <>
      {isVisible &&
        iconsData.map((it, index) => (
          <FloatingObject
            // animationSeed.current를 사용하여 키가 고정되도록 함
            key={`${animationSeed.current}-${index}`}
            icon={<it.Icon className={`bg-white-accent ${it.size}`} />}
            color={it.color}
            top={it.top}
            left={it.left}
            // 애니메이션 지연 시간 설정 (화면 크기에 따른 간격)
            delay={40 + index * 40}
          />
        ))}
    </>
  );
}
