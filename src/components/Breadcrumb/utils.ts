// 경로 한글 이름 매핑
export const breadcrumbNameMap: Record<string, string> = {
  home: "홈", // 루트 경로
  projects: "프로젝트",
  blog: "블로그",
  tags: "태그",
  pages: "페이지",
  admin: "관리자",
  about: "소개",
  contact: "연락처",
  edit: "수정",
  new: "작성",
  login: "로그인",
};

// 시각적으로 숨길 경로들
export const HIDDEN_PATHS = ["detail", "pages", "tags"];

// ✅ 특정 경로가 포함되면 그다음 경로도 함께 숨길 목록
export const HIDDEN_WITH_NEXT_PATHS = ["pages"];

// 경로 변환 함수
export function getBreadcrumbPaths(pathname: string) {
  // 기본 숨김 경로 + 다음 경로까지 숨기는 경로
  const allHiddenPaths = new Set([...HIDDEN_PATHS]);
  const cascadeHiddenPaths = new Set([...HIDDEN_WITH_NEXT_PATHS]);

  // 경로를 분할하고 빈 문자열 제거
  const paths = pathname.split("/").filter(segment => segment);

  const breadcrumbPaths = [];
  let skipNext = false; // 다음 경로를 건너뛸지 여부

  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i];

    // 이전 경로에서 숨김 대상이면 현재 경로도 제거
    if (skipNext) {
      skipNext = false;
      continue;
    }

    // 현재 경로가 숨김 대상이면 다음 경로도 건너뛰기
    if (allHiddenPaths.has(segment)) {
      skipNext = cascadeHiddenPaths.has(segment);
      continue;
    }

    // 현재 세그먼트까지의 전체 경로 계산
    const fullPath = "/" + paths.slice(0, i + 1).join("/");

    breadcrumbPaths.push({
      name: breadcrumbNameMap[segment] || decodeURIComponent(segment),
      link: fullPath,
    });
  }

  // 항상 Home을 첫 번째 경로로 추가
  return [{ name: "홈", link: "/" }, ...breadcrumbPaths];
}
