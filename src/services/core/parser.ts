// src/utils/silentParse.ts
import { z } from "zod";

/**
 * 데이터 파싱 함수 (Astro 호환)
 * - Zod 스키마를 사용하여 데이터를 검증
 * - 실패 시 오류를 콘솔에 출력하지만 throw하지 않음
 *
 * @param zod Zod 스키마
 * @param input 파싱할 데이터
 * @param debugHint 디버깅 메시지 (선택 사항)
 * @returns 파싱된 데이터 (실패 시 원본 반환)
 */
export const silentParse = <T extends z.ZodTypeAny>(
  zod: T,
  input: unknown,
  debugHint?: string,
): z.infer<T> => {
  const parseResult = zod.safeParse(input);

  if (!parseResult.success) {
    console.error(
      `데이터 파싱 실패: ${debugHint ?? "No debug hint provided"}`,
      parseResult.error,
    );
    return input as z.infer<T>; // 실패 시 원본 반환
  }

  return parseResult.data;
};
