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
}

const IconDropdown: React.FC<IconDropdownProps> = ({
  title,
  icon,
  dropdownContent,
  widthClass = "w-80",
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

  // hover 가능 디바이스일 경우에만 마우스 엔터 이벤트로 드롭다운 열기
  const handleMouseEnter = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      // 수평은 버튼 영역만, 수직은 버튼과 드롭다운의 union 사용
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
      onMouseEnter={handleMouseEnter} // hover 디바이스라면 드롭다운 열림
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
