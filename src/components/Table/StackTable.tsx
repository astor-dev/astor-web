import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { stacks } from "~constants/stacks";
import { stackTypeEnum, type StackType } from "~types/stack.type";
import type { ProjectEntry } from "~types/project.type";
import StackItem from "~components/Stack/StackItem";

interface StackSliderProps {
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
  [stackTypeEnum.Enum.ETC]: 4,
};

const parseType = (type: StackType | "all") => {
  switch (type) {
    case stackTypeEnum.Enum.Frontend:
      return "FE";
    case stackTypeEnum.Enum.Backend:
      return "BE";
    case stackTypeEnum.Enum.DevOps:
      return "DevOps";
    case stackTypeEnum.Enum.ETC:
      return "ETC";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
};

const StackTable: React.FC<StackSliderProps> = ({
  stackIds,
  defaultType = "all",
  enableFeatured = false,
  relatedProjects = {},
}) => {
  const [selectedType, setSelectedType] = useState<StackType | "all">(
    defaultType,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 반응형에 따른 페이지당 아이템 수 설정
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(20); // lg: 5열 × 4행
      } else if (width >= 768) {
        setItemsPerPage(16); // md: 4열 × 4행
      } else if (width >= 640) {
        setItemsPerPage(12); // sm: 3열 × 4행
      } else {
        setItemsPerPage(8); // 2열 × 4행
      }
    };

    setIsLoading(false);

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

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
          (stackTypeOrder[a.stackType[0]] ?? Infinity) -
          (stackTypeOrder[b.stackType[0]] ?? Infinity)
        );
      }
      return a.name.localeCompare(b.name);
    });

  // 사용 가능한 스택 타입도 정의된 순서대로 정렬
  const allStackTypes = Array.from(
    new Set(
      availableStacks.flatMap(stack =>
        Array.isArray(stack.stackType) ? stack.stackType : [stack.stackType],
      ),
    ),
  ).sort(
    (a, b) => (stackTypeOrder[a] ?? Infinity) - (stackTypeOrder[b] ?? Infinity),
  );

  const availableTypes: (StackType | "all")[] = ["all", ...allStackTypes];

  const filteredStacks = availableStacks.filter(stack => {
    if (selectedType === "all") return true;

    const stackTypes = Array.isArray(stack.stackType)
      ? stack.stackType
      : [stack.stackType];
    return stackTypes.includes(selectedType as StackType);
  });

  // 페이징 계산
  const totalPages = Math.ceil(filteredStacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStacks = filteredStacks.slice(startIndex, endIndex);

  // 필터 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, itemsPerPage]);

  useEffect(() => {
    if (selectedType !== defaultType) {
      setSelectedType(defaultType);
    }
  }, [defaultType]);

  // 페이지네이션 핸들러
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // const handlePageClick = (page: number) => {
  //   setCurrentPage(page);
  // };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 필터 버튼 */}
      <div
        className={`relative mb-6 flex flex-wrap justify-center gap-2 overflow-y-auto px-1 py-2 duration-300`}
      >
        {isLoading ? (
          // 필터 버튼 스켈레톤
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <span className="h-7 w-16">
                <Skeleton
                  key={index}
                  height={"100%"}
                  width={"100%"}
                  borderRadius={15}
                />
              </span>
            ))}
          </div>
        ) : (
          availableTypes.map(type => (
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
              {parseType(type)}
            </button>
          ))
        )}
      </div>

      {/* 스택 그리드 (페이징) */}
      <div className="h-[192px]">
        {isLoading ? (
          // 전체 그리드 영역 스켈레톤
          <div className="h-full p-1">
            <Skeleton height="100%" borderRadius={8} />
          </div>
        ) : filteredStacks.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 p-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {currentStacks.map(stack => (
              <div
                key={stack.id}
                className="transition-opacity duration-200 ease-in-out"
              >
                <StackItem
                  stack={stack}
                  showFeatured={enableFeatured}
                  relatedProjects={relatedProjects[stack.id] || []}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-black-muted">
              해당하는 스택이 없습니다.
            </p>
          </div>
        )}
      </div>

      {/* 페이지네이션 (그리드 하단) */}

      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          {isLoading ? (
            // 페이지네이션 스켈레톤
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold transition-colors">
              <Skeleton width={120} height={"100%"} borderRadius={8} />
            </div>
          ) : (
            <>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold transition-colors ${
                  currentPage === 1
                    ? "cursor-not-allowed text-black-muted"
                    : "hover:bg-skin-card text-black-base"
                }`}
              >
                &lt;
              </button>

              <div className="bg-skin-card flex items-center justify-center rounded-lg px-3 py-1.5">
                <span className="text-sm font-medium text-skin-base">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold transition-colors ${
                  currentPage === totalPages
                    ? "cursor-not-allowed text-black-muted"
                    : "hover:bg-skin-card text-black-base"
                }`}
              >
                &gt;
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackTable;
