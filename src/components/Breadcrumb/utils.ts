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
};

// 경로 변환 함수
export function getBreadcrumbPaths(pathname: string) {
  const paths = pathname.split("/").filter(segment => segment);
  const breadcrumbPaths = paths.map((segment, index) => {
    const link = "/" + paths.slice(0, index + 1).join("/");
    return {
      name: breadcrumbNameMap[segment] || decodeURIComponent(segment),
      link,
    };
  });

  // 항상 Home을 첫 번째 경로로 추가
  return [{ name: "홈", link: "/" }, ...breadcrumbPaths];
}
