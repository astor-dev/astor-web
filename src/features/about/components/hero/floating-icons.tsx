// components/Icon/FloatingIcons.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import { useViewport } from "~common/hooks/use-viewport";
import { stacks } from "~common/constants/stacks";
import { FaHeart } from "react-icons/fa";
import FloatingObject from "~features/about/components/hero/floating-object";

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

export default function FloatingIcons(props: {
  isAstora: boolean; // true면 하트 아이콘으로!
  isVisible: boolean;
}) {
  const [isVisible, setIsVisible] = useState(props.isVisible);
  // animationSeed를 useRef로 관리하여 초기값을 고정합니다.
  const animationSeed = useRef(Date.now());

  useEffect(() => {
    setIsVisible(props.isVisible);
  }, [props.isVisible]);

  const { width } = useViewport();
  // 브레이크포인트에 따른 아이콘 개수 설정
  const getCounter = () => {
    if (width < 640) return 16;
    if (props.isAstora) return 30;
    return 20;
  };
  const counter = getCounter();

  /**
   * isAstora일 때: 하트만 들어있는 배열을 만들어서 icons로 사용
   * isAstora가 false면: 기존 stacks 배열을 사용
   */
  const icons = useMemo(() => {
    if (props.isAstora) {
      // ex) 하트 색상은 빨간색으로 통일
      return new Array(stacks.length).fill({
        icon: FaHeart,
        color: "#ff5050",
      });
    } else {
      return stacks.map(stack => ({
        icon: stack.icon,
        color: stack.color,
      }));
    }
    // isAstora가 바뀌면 다시 계산
  }, [props.isAstora]);

  /**
   * iconsData 생성 로직
   * icons 배열이 바뀌면(즉, isAstora 값이 바뀌면) 새로 아이콘 정보 생성
   */
  const iconsData = useMemo(() => {
    const usedIcons = new Set();
    const data = [];
    for (let i = 0; i < counter; i++) {
      let randomIndex;
      // 중복 아이콘 사용 방지
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
