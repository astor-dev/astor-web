// 경로 한글 이름 매핑
export const breadcrumbNameMap: Record<string, string> = {
  home: "홈", // 루트 경로
  projects: "프로젝트",
  details: "상세정보",
  admin: "관리자",
  about: "소개",
  contact: "연락처",
  edit: "수정",
  new: "작성",
  blog: "블로그",
  login: "로그인",
};

// 시각적으로 숨길 경로들
export const HIDDEN_PATHS = ["detail", "details"];

// 경로 변환 함수
export function getBreadcrumbPaths(pathname: string) {
  // 경로를 분할하고 빈 문자열 제거
  const paths = pathname.split("/").filter(segment => segment);

  // HIDDEN_PATHS에 포함된 경로는 제외하고 breadcrumb 생성
  const breadcrumbPaths = paths
    .filter(segment => !HIDDEN_PATHS.includes(segment))
    .map((segment, index) => {
      // 현재 세그먼트까지의 전체 경로 계산 (숨겨진 경로 포함)
      const fullPath =
        "/" + paths.slice(0, paths.indexOf(segment) + 1).join("/");

      return {
        name: breadcrumbNameMap[segment] || decodeURIComponent(segment),
        link: fullPath,
      };
    });

  // 항상 Home을 첫 번째 경로로 추가
  return [{ name: "홈", link: "/" }, ...breadcrumbPaths];
}
