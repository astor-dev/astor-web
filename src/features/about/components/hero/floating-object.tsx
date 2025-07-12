import React, { useState, useEffect } from "react";

export default function FloatingObject({
  icon,
  color,
  top,
  left,
  delay = 40, // 애니메이션 지연 시간 (밀리초)
}: {
  icon: React.ReactNode;
  color: string;
  top: string;
  left: string;
  delay?: number;
}) {
  const [isSpread, setIsSpread] = useState(false);

  useEffect(() => {
    // 초기 스프레드 애니메이션
    const spreadTimeout = setTimeout(() => {
      setIsSpread(true);
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
      className={`absolute z-0 transition-all duration-1000 ease-out`}
      style={isSpread ? finalStyle : initialStyle}
    >
      <div className={`transition-opacity duration-300`} style={{ color }}>
        {icon}
      </div>
    </div>
  );
}
