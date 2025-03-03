import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { stacks } from "~constants/stacks";
import { stackTypeEnum, type StackType } from "~types/stack.type";
import StackItem from "./StackItem";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import type { ProjectEntry } from "~types/project.type";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface StackGridProps {
  stackIds?: number[];
  defaultType?: StackType | "all";
  enableFeatured?: boolean;
  relatedProjects?: Record<number, ProjectEntry[]>;
}

// 스택 타입 순서 정의
const stackTypeOrder: Record<StackType, number> = {
  [stackTypeEnum.Enum.Frontend]: 1,
  [stackTypeEnum.Enum.Backend]: 2,
  [stackTypeEnum.Enum.DevOps]: 3,
};

const StackGrid: React.FC<StackGridProps> = ({
  stackIds,
  defaultType = "all",
  enableFeatured = false,
  relatedProjects = {},
}) => {
  const [selectedType, setSelectedType] = useState<StackType | "all">(
    defaultType,
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(gridRef);

  const availableStacks = stacks
    .filter(stack => (stackIds ? stackIds.includes(stack.id) : true))
    .sort((a, b) => {
      if (enableFeatured) {
        if (a.superFeatured !== b.superFeatured) {
          return b.superFeatured ? 1 : -1;
        }
        if (a.featured !== b.featured) {
          return b.featured ? 1 : -1;
        }
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

  useEffect(() => {
    if (selectedType !== defaultType) {
      setSelectedType(defaultType);
    }
  }, [defaultType]);

  return (
    <div className="relative w-full">
      {/* 필터 버튼 */}
      <div
        ref={gridRef}
        className={`relative mb-6 flex max-h-[120px] flex-wrap justify-center gap-2 overflow-y-auto px-1 py-2 transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {availableTypes.map(type => (
          <button
            type="button"
            key={type}
            onClick={() => setSelectedType(type)}
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
      <div className="relative">
        <div className="grid max-h-[60dvh] grid-cols-2 gap-4 overflow-y-auto pb-4 md:max-h-none md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
          <AnimatePresence mode="sync">
            {filteredStacks.length > 0 ? (
              filteredStacks.map(stack => (
                <StackItem
                  key={stack.id}
                  stack={stack}
                  showFeatured={enableFeatured}
                  relatedProjects={relatedProjects[stack.id] || []}
                />
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
