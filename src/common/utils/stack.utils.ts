import {
  stackTypeEnum,
  type Stack,
  type StackType,
} from "~common/types/stack.type";
import { stacks as allStacks } from "~common/constants/stacks";

// 스택 타입 순서 정의
const stackTypeOrder: Record<StackType | "all", number> = {
  all: 0,
  [stackTypeEnum.Enum.Frontend]: 1,
  [stackTypeEnum.Enum.Backend]: 2,
  [stackTypeEnum.Enum.DevOps]: 3,
  [stackTypeEnum.Enum.ETC]: 4,
};

/**
 * 스택 배열을 정렬하는 함수
 * @param stacks - 정렬할 스택 배열
 * @param enableFeatured - featured 정렬 활성화 여부
 * @returns 정렬된 스택 배열
 */
export const sortStacks = (
  stacks: Stack[],
  enableFeatured: boolean,
): Stack[] => {
  return [...stacks].sort((a, b) => {
    if (enableFeatured) {
      if (a.superFeatured !== b.superFeatured) {
        return b.superFeatured ? 1 : -1;
      }
      if (a.featured !== b.featured) {
        return b.featured ? 1 : -1;
      }
    }
    if (a.stackType[0] !== b.stackType[0]) {
      return (
        (stackTypeOrder[a.stackType[0]] ?? Infinity) -
        (stackTypeOrder[b.stackType[0]] ?? Infinity)
      );
    }
    return a.name.localeCompare(b.name);
  });
};

/**
 * 간단한 스택 객체를 타입별로 그룹화하고 정렬된 풍부한 스택 객체로 변환
 * @param simpleStacks - id와 type만 있는 간단한 스택 배열
 * @param enableFeatured - featured 정렬 활성화 여부
 * @returns 타입별로 그룹화되고 정렬된 풍부한 스택 객체
 */
export const convertToRichStacksRecord = (
  simpleStacks: { type: StackType; id: number }[],
  enableFeatured: boolean = false,
): Record<StackType | "all", Stack[]> => {
  const richStacks: Record<StackType | "all", Stack[]> = simpleStacks.reduce(
    (acc, stack) => {
      const stackType = stack.type;
      if (!acc[stackType]) acc[stackType] = [];
      if (!acc["all"]) acc["all"] = [];

      const foundStack = allStacks.find(s => s.id === stack.id);
      if (!foundStack) return acc;

      if (!acc[stackType].some(s => s.id === foundStack.id)) {
        acc[stackType].push(foundStack);
      }
      if (!acc["all"].some(s => s.id === foundStack.id)) {
        acc["all"].push(foundStack);
      }
      return acc;
    },
    {} as Record<StackType | "all", Stack[]>,
  );

  // 각 타입별로 정렬
  for (const key in richStacks) {
    richStacks[key as keyof typeof richStacks] = sortStacks(
      richStacks[key as keyof typeof richStacks],
      enableFeatured,
    );
  }

  return richStacks;
};

/**
 * 간단한 스택 객체를 정렬된 Stack[] 배열로 변환 (중복 제거)
 * @param simpleStacks - id와 type만 있는 간단한 스택 배열
 * @param enableFeatured - featured 정렬 활성화 여부
 * @returns 정렬된 풍부한 스택 배열
 */
export const convertToRichStacksArray = (
  simpleStacks: { type: StackType; id: number }[],
  enableFeatured: boolean = false,
): Stack[] => {
  const richStacks = convertToRichStacksRecord(simpleStacks, enableFeatured);

  // 모든 스택을 하나의 배열로 합치기 (중복 제거)
  const allStacksArray: Stack[] = [];
  Object.values(richStacks).forEach(stacks => {
    stacks.forEach(stack => {
      if (!allStacksArray.some(s => s.id === stack.id)) {
        allStacksArray.push(stack);
      }
    });
  });

  return sortStacks(allStacksArray, enableFeatured);
};

/**
 * 사용 가능한 스택 타입들을 순서대로 반환
 * @param richStacks - 풍부한 스택 객체
 * @returns 정렬된 사용 가능한 스택 타입 배열
 */
export const getAvailableTypes = (
  richStacks: Record<StackType | "all", Stack[]>,
): (StackType | "all")[] => {
  const keys = Object.keys(richStacks) as (keyof typeof richStacks)[];
  return keys
    .filter(
      (key): key is StackType | "all" =>
        richStacks[key] && richStacks[key].length > 0,
    )
    .sort(
      (a, b) =>
        (stackTypeOrder[a] ?? Infinity) - (stackTypeOrder[b] ?? Infinity),
    );
};

/**
 * 특정 타입의 스택들을 필터링
 * @param richStacks - 풍부한 스택 객체
 * @param selectedType - 선택된 타입
 * @returns 필터링된 스택 배열
 */
export const getFilteredStacks = (
  richStacks: Record<StackType | "all", Stack[]>,
  selectedType: StackType | "all",
): Stack[] => {
  return (
    richStacks[selectedType]?.filter(stack => {
      if (selectedType === "all") return true;
      const stackTypes = Array.isArray(stack.stackType)
        ? stack.stackType
        : [stack.stackType];
      return stackTypes.includes(selectedType as StackType);
    }) || []
  );
};
