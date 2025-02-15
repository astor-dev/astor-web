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

export default function FloatingIcons(props: { isVisible: boolean }) {
  const [isVisible, setIsVisible] = useState(props.isVisible);
  // animationSeed를 통해 컴포넌트 재마운트 시 새로운 키를 부여합니다.
  const [animationSeed, setAnimationSeed] = useState(Date.now());

  useEffect(() => {
    setIsVisible(props.isVisible);
    // isVisible이 true로 전환될 때마다 seed 업데이트
    if (props.isVisible) {
      setAnimationSeed(Date.now());
    }
  }, [props.isVisible]);

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
        floatingAnimation,
      });
    }
    return data;
  }, [icons, counter]);

  return (
    <>
      {isVisible &&
        iconsData.map((it, index) => (
          <FloatingObject
            // animationSeed와 index를 결합하여 키를 재생성
            key={`${animationSeed}-${index}`}
            icon={<it.Icon className={`bg-white-accent ${it.size}`} />}
            color={it.color}
            top={it.top}
            left={it.left}
            floatingAnimation={it.floatingAnimation}
            // 애니메이션 지연 시간 설정 (화면 크기에 따른 간격)
            delay={
              40 + width < 640
                ? index * 40
                : width < 1024
                  ? index * 30
                  : index * 25
            }
          />
        ))}
    </>
  );
}
