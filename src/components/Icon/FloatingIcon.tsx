// components/FloatingIcons.jsx
import React from "react";

import { useViewport } from "../../hooks/UseViewport/UseViewport";
import FloatingObject from "~components/Icon/FloatingObject";

// 아이콘 배치 컴포넌트
export default function FloatingIcons({
  icons,
}: {
  icons: {
    Icon: React.ElementType;
    size: string;
    color: string;
    top: string;
    left: string;
  }[];
}) {
  const { width } = useViewport();

  // Define breakpoints
  const getCounter = () => {
    if (width < 640) return 4; // Mobile
    if (width < 1024) return 8; // Tablet
    return 12; // Desktop and larger
  };

  const counter = getCounter();

  // Shuffle the icons array to randomize icon selection
  const shuffledIcons = [...icons].sort(() => 0.5 - Math.random());

  // Select the first 'counter' number of icons
  const selectedIcons = shuffledIcons.slice(0, counter);

  return (
    <>
      {selectedIcons.map((it, index) => (
        <FloatingObject
          key={index}
          icon={<it.Icon />}
          size={it.size}
          color={it.color}
          top={it.top}
          left={it.left}
          // Randomly assign one of the floating animations (0, 1, or 2)
          animation={`animate-floating-${index % 3}`}
        />
      ))}
    </>
  );
}
