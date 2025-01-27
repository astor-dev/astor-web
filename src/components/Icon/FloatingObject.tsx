// components/Icon/FloatingObject.jsx
import React, { useState, useEffect } from "react";

export default function FloatingObject({
  icon,
  size,
  color,
  top,
  left,
  animation,
  delay = 0, // 애니메이션 지연 시간 (밀리초)
}: {
  icon: React.ReactNode;
  size: string;
  color: string;
  top: string;
  left: string;
  animation: string;
  delay?: number;
}) {
  const [isSpread, setIsSpread] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSpread(true);
    }, delay);

    return () => clearTimeout(timeout);
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
  };

  return (
    <div
      className={`absolute z-0 transition-all duration-1000 ease-out ${animation}`}
      style={isSpread ? finalStyle : initialStyle}
    >
      <div className={`${size} ${color} transition-opacity duration-300`}>
        {icon}
      </div>
    </div>
  );
}
