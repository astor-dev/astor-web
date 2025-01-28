import React, { useState, useEffect } from "react";

export default function FloatingObject({
  icon,
  size,
  color,
  top,
  left,
  floatingAnimation,
  delay = 0, // 애니메이션 지연 시간 (밀리초)
}: {
  icon: React.ReactNode;
  size: string;
  color: string;
  top: string;
  left: string;
  floatingAnimation: string;
  delay?: number;
}) {
  const [isSpread, setIsSpread] = useState(false);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    // 초기 스프레드 애니메이션
    const spreadTimeout = setTimeout(() => {
      setIsSpread(true);

      // 스프레드 애니메이션 완료 0.5초 후 플로팅 시작
      const floatTimeout = setTimeout(() => {
        setIsFloating(true);
      }, 500);

      return () => clearTimeout(floatTimeout);
    }, delay);

    return () => clearTimeout(spreadTimeout);
  }, [delay]);

  const initialStyle = {
    top: "50%",
    left: "50%",
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0.5)",
  };

  const finalStyle = {
    top: top,
    left: left,
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    rotate: "0deg",
  };

  return (
    <div
      className={`absolute z-0 transition-all duration-1000 ease-out ${
        isFloating ? floatingAnimation : ""
      }`}
      style={isSpread ? finalStyle : initialStyle}
    >
      <div className={`${size} ${color} transition-opacity duration-300`}>
        {icon}
      </div>
    </div>
  );
}
