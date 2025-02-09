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
  isMobile: boolean;
}

const IconDropdown: React.FC<IconDropdownProps> = ({
  title,
  icon,
  dropdownContent,
  widthClass = "w-80",
  isMobile,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫힘 (변경 없음)
  useOutsideClick(containerRef as React.RefObject<HTMLElement>, () => {
    if (open) setOpen(false);
  });

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setOpen(true);
    }
  };

  // open 상태일 때, 마우스가 버튼과 드롭다운(투명 spacer 포함)의 영역을 벗어나면 닫기
  useEffect(() => {
    if (!open) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 버튼(컨테이너)의 bounding rect
      const containerRect = containerRef.current?.getBoundingClientRect();
      // 드롭다운의 bounding rect (존재하는 경우)
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();

      if (!containerRect) return;

      // 두 영역의 union을 계산
      let unionLeft = containerRect.left;
      let unionRight = containerRect.right;
      let unionTop = containerRect.top;
      let unionBottom = containerRect.bottom;

      if (dropdownRect) {
        unionLeft = Math.min(unionLeft, dropdownRect.left);
        unionRight = Math.max(unionRight, dropdownRect.right);
        unionTop = Math.min(unionTop, dropdownRect.top);
        unionBottom = Math.max(unionBottom, dropdownRect.bottom);
      }

      // 마우스 좌표가 union 영역 밖이라면 닫기
      if (
        e.clientX < unionLeft ||
        e.clientX > unionRight ||
        e.clientY < unionTop ||
        e.clientY > unionBottom
      ) {
        setOpen(false);
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
      onMouseEnter={handleMouseEnter}
    >
      <button
        title={title}
        onClick={handleToggle}
        className={`flex h-10 w-10 items-center justify-center ${
          open ? "text-skin-accent" : "hover:text-skin-accent"
        }`}
      >
        {icon}
      </button>
      {open && (
        <>
          {/* 버튼과 드롭다운 사이의 공백을 덮는 투명 spacer */}
          <div
            className="absolute left-0 right-0 top-full h-2"
            style={{ zIndex: 1 }}
          />
          <div
            ref={dropdownRef}
            className={`absolute left-1/2 top-full mt-2 ${widthClass} max-w-[calc(100vw-1rem)] -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-lg`}
            style={{ zIndex: 10 }}
          >
            {dropdownContent}
          </div>
        </>
      )}
    </div>
  );
};

export default IconDropdown;
