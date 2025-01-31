import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { stacks } from "~constants/stacks";
import { stackTypeEnum, type StackType } from "~types/stack.type";
import StackItem from "./StackItem";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";

interface StackGridProps {
  stackIds?: number[];
}

// 스택 타입 순서 정의
const stackTypeOrder: Record<StackType, number> = {
  [stackTypeEnum.Enum.Frontend]: 1,
  [stackTypeEnum.Enum.Backend]: 2,
  [stackTypeEnum.Enum.DevOps]: 3,
};

const StackGrid: React.FC<StackGridProps> = ({ stackIds }) => {
  const [selectedType, setSelectedType] = useState<StackType | "all">("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(gridRef, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  const availableStacks = stacks
    .filter(stack => (stackIds ? stackIds.includes(stack.id) : true))
    .sort((a, b) => {
      if (a.superFeatured !== b.superFeatured) {
        return b.superFeatured ? 1 : -1;
      }
      if (a.featured !== b.featured) {
        return b.featured ? 1 : -1;
      }
      if (a.stackType !== b.stackType) {
        return (
          (stackTypeOrder[a.stackType] ?? Infinity) -
          (stackTypeOrder[b.stackType] ?? Infinity)
        );
      }
      return a.name.localeCompare(b.name);
    });

  // 사용 가능한 스택 타입도 정의된 순서대로 정렬
  const availableTypes = [
    "all" as const,
    ...Array.from(new Set(availableStacks.map(stack => stack.stackType))).sort(
      (a, b) =>
        (stackTypeOrder[a] ?? Infinity) - (stackTypeOrder[b] ?? Infinity),
    ),
  ];

  const filteredStacks = availableStacks.filter(stack =>
    selectedType === "all" ? true : stack.stackType === selectedType,
  );

  // 상태 변경 시 로그 출력
  useEffect(() => {
    console.log("Selected Type changed:", selectedType);
    console.log("Filtered Stacks:", filteredStacks);
  }, [selectedType, filteredStacks]);

  return (
    <div className="w-full px-4">
      {/* 필터 버튼 */}
      <div
        ref={gridRef}
        className={`mb-6 flex flex-wrap justify-center gap-2 transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {availableTypes.map(type => (
          <button
            type="button"
            key={type}
            onClick={() => {
              console.log("Clicked Type:", type);
              setSelectedType(type);
            }}
            className={`z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              selectedType === type
                ? "bg-skin-accent text-white-base shadow-md"
                : "bg-skin-card hover:bg-skin-card-muted text-skin-base"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* 스택 그리드 */}
      <div className="relative overflow-visible">
        <div className="grid grid-cols-2 gap-4 overflow-visible sm:grid-cols-3 md:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredStacks.length > 0 ? (
              filteredStacks.map(stack => (
                <div className="overflow-visible" key={stack.id}>
                  <StackItem stack={stack} />
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-black-muted">
                해당하는 스택이 없습니다.
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StackGrid;
