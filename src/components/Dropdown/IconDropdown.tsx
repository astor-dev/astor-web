import React, { useState, useEffect, useRef } from "react";

// 외부 클릭 감지 훅 (변경 없음)
function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  handler: () => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

interface IconDropdownProps {
  title: string;
  icon: React.ReactNode;
  dropdownContent: React.ReactNode;
  widthClass?: string;
  /** 부모 컴포넌트의 컨테이너 ref (드롭다운을 이 영역 내에 가두기 위함) */
  parentContainerRef: React.RefObject<HTMLElement>;
}

const IconDropdown: React.FC<IconDropdownProps> = ({
  title,
  icon,
  dropdownContent,
  widthClass = "w-80",
  parentContainerRef,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<"down" | "up">(
    "down",
  );
  const [horizontalOffset, setHorizontalOffset] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 터치 이벤트 중복 방지를 위한 플래그
  const touchTriggeredRef = useRef<boolean>(false);

  // hover 지원 여부 (데스크탑 vs 모바일)
  const [hoverEnabled, setHoverEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mql = window.matchMedia("(hover: hover)");
      setHoverEnabled(mql.matches);
    }
  }, []);

  // 외부 클릭 시 닫힘
  useOutsideClick(containerRef as React.RefObject<HTMLElement>, () => {
    if (open) setOpen(false);
  });

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (touchTriggeredRef.current) {
      touchTriggeredRef.current = false;
      return;
    }
    handleToggle();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    touchTriggeredRef.current = true;
    handleToggle();
  };

  const handleMouseEnter = () => {
    if (hoverEnabled) {
      setOpen(true);
    }
  };

  // 드롭다운 열릴 때 수직 방향 조정 (버튼 아래 공간 부족 시 위쪽으로)
  useEffect(() => {
    if (open && containerRef.current && dropdownRef.current) {
      const buttonRect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      if (spaceBelow < dropdownHeight + 10) {
        setDropdownDirection("up");
      } else {
        setDropdownDirection("down");
      }
    }
  }, [open]);

  // 드롭다운 열릴 때 부모 컨테이너(외부)의 가로 영역을 기준으로 수평 오버플로우 조정
  useEffect(() => {
    if (open && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      let offset = 0;
      let containerBounds;
      if (parentContainerRef && parentContainerRef.current) {
        containerBounds = parentContainerRef.current.getBoundingClientRect();
      } else {
        // 부모 컨테이너 ref가 없으면 기본적으로 뷰포트 전체를 기준으로 함
        containerBounds = { left: 0, right: window.innerWidth };
      }
      if (rect.left < containerBounds.left) {
        offset = containerBounds.left - rect.left;
      } else if (rect.right > containerBounds.right) {
        offset = containerBounds.right - rect.right;
      }
      setHorizontalOffset(offset);
    } else {
      setHorizontalOffset(0);
    }
  }, [open, parentContainerRef]);

  // 마우스 이동으로 외부 클릭 감지 (기존 로직 유지)
  useEffect(() => {
    if (!open) return;
    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const unionLeft = containerRect.left;
      const unionRight = containerRect.right;
      const unionTop = containerRect.top;
      const unionBottom = dropdownRect
        ? dropdownRect.bottom
        : containerRect.bottom;
      if (
        e.clientX < unionLeft ||
        e.clientX > unionRight ||
        e.clientY < unionTop ||
        e.clientY > unionBottom
      ) {
        if (dropdownRect) {
          if (
            e.clientX < dropdownRect.left ||
            e.clientX > dropdownRect.right ||
            e.clientY < dropdownRect.top ||
            e.clientY > dropdownRect.bottom
          ) {
            setOpen(false);
          }
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      {...(hoverEnabled ? { onMouseEnter: handleMouseEnter } : {})}
    >
      <button
        title={title}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        className={`flex h-10 w-10 items-center justify-center ${
          open ? "text-skin-accent" : "hover:text-skin-accent"
        }`}
      >
        {icon}
      </button>
      {open && (
        <>
          {/* 버튼과 드롭다운 사이의 spacer */}
          <div
            className="absolute left-0 right-0"
            style={{
              zIndex: 1,
              height: "2px",
              ...(dropdownDirection === "down"
                ? { top: "100%" }
                : { bottom: "100%" }),
            }}
          />
          <div
            ref={dropdownRef}
            className={`absolute rounded-lg bg-white p-4 shadow-lg ${widthClass} max-w-[calc(100dvw-1rem)] ${
              dropdownDirection === "down"
                ? "top-full mt-2"
                : "bottom-full mb-2"
            }`}
            style={{
              zIndex: 10,
              left: "50%",
              transform: `translateX(calc(-50% + ${horizontalOffset}px))`,
            }}
          >
            {dropdownContent}
          </div>
        </>
      )}
    </div>
  );
};

export default IconDropdown;
