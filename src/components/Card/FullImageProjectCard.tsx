import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import type { ProjectEntry } from "~/types/project.type";
import { stacks } from "~constants/stacks";
import { stackTypeEnum, type Stack } from "~types/stack.type";

/** HeroCard 스타일로 완전히 재구성한 컴포넌트 */
interface ProjectCardProps extends ProjectEntry {
  // 추가적으로 필요한 props가 있다면 여기에 선언
  // (기존 showInitialAnimation 등은 제거했습니다.)
}

interface ProjectRolesMiniProps {
  roles: string[];
  theme: ColorTheme;
}

interface ProjectStacksMiniProps {
  stackIds: number[];
  theme: ColorTheme;
}

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// 프로젝트별 색상 테마 정의
const getProjectColorTheme = (projectName: string): ColorTheme => {
  const themes: Record<string, ColorTheme> = {
    핸디버스: {
      primary: "#006400",
      secondary: "#008000",
      accent: "#228B22",
      background: "#f8faf8",
      text: "#006400",
    },
    히얼러스: {
      primary: "#4d317e",
      secondary: "#6b46c1",
      accent: "#86198f",
      background: "#f5f3ff",
      text: "#4d317e",
    },
    "where-to-pop": {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#60A5FA",
      background: "#EFF6FF",
      text: "#1E3A8A",
    },
    "astor-dev": {
      primary: "#8B5CF6",
      secondary: "#6D28D9",
      accent: "#A78BFA",
      background: "#F3F4F6",
      text: "#581C87",
    },
    default: {
      primary: "#6366F1",
      secondary: "#4F46E5",
      accent: "#818CF8",
      background: "#F8FAFC",
      text: "#312E81",
    },
  };

  return themes[projectName] || themes["default"];
};

const ProjectRolesSection = ({ roles, theme }: ProjectRolesMiniProps) => {
  return (
    <section className="mb-4">
      <h2 className="mb-2 text-base font-bold" style={{ color: theme.text }}>
        역할
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {roles.map(role => (
          <div
            key={role}
            className="flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: theme.primary + "20",
              color: theme.secondary,
            }}
          >
            {role}
          </div>
        ))}
      </div>
    </section>
  );
};

const ProjectStacksSection = ({ stackIds, theme }: ProjectStacksMiniProps) => {
  const getStacksForProject = (stackIds: number[]): Stack[] => {
    const projectStacks = stackIds
      .map(id => stacks.find(stack => stack.id === id))
      .filter(Boolean)
      .filter(stack => stack !== undefined);

    // 우선순위 정렬: superFeatured > featured > Backend > DevOps > 나머지
    const sortedStacks = projectStacks.sort((a, b) => {
      if (a.superFeatured && !b.superFeatured) return -1;
      if (!a.superFeatured && b.superFeatured) return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      const aHasBackend = a.stackType.includes(stackTypeEnum.options[1]);
      const bHasBackend = b.stackType.includes(stackTypeEnum.options[1]);
      if (aHasBackend && !bHasBackend) return -1;
      if (!aHasBackend && bHasBackend) return 1;

      const aHasDevOps = a.stackType.includes(stackTypeEnum.options[2]);
      const bHasDevOps = b.stackType.includes(stackTypeEnum.options[2]);
      if (aHasDevOps && !bHasDevOps) return -1;
      if (!aHasDevOps && bHasDevOps) return 1;

      return 0;
    });

    return sortedStacks;
  };

  const sortedStacks = getStacksForProject(stackIds);
  const displayStacks = sortedStacks.slice(0, 6);
  const remainingCount = sortedStacks.length - 6;

  return (
    <section className="mb-4 flex-1">
      <h2 className="mb-2 text-base font-bold" style={{ color: theme.text }}>
        사용 기술
      </h2>
      <div className="grid grid-cols-2 gap-1.5">
        {displayStacks.map(stack => (
          <div
            key={stack.id}
            className="flex items-center space-x-1.5 rounded-md p-1.5 text-xs"
            style={{ backgroundColor: theme.background }}
          >
            <stack.icon
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{ color: stack.color }}
            />
            <span className="truncate" style={{ color: theme.text }}>
              {stack.name}
            </span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className="flex items-center justify-center rounded-md p-1.5 text-xs"
            style={{ backgroundColor: theme.accent + "30" }}
          >
            <span style={{ color: theme.secondary }}>+{remainingCount}개</span>
          </div>
        )}
      </div>
    </section>
  );
};

const FullImageProjectCard = (props: ProjectCardProps) => {
  const { data } = props;
  const {
    imageUrl,
    projectName,
    companyName,
    shortDescription,
    roles,
    stackIds,
  } = data;

  const theme = getProjectColorTheme(projectName);

  return (
    <a
      href={`/projects/${projectName}`}
      className="group relative block h-full w-full cursor-pointer overflow-hidden transition-all duration-300"
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-5">
        {/* 이미지 섹션 - 3/5 비율 */}
        <div className="relative h-full w-full overflow-hidden md:col-span-3">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent md:hidden" />
          <ImageWithSkeleton
            src={imageUrl}
            alt={projectName}
            className="h-full w-full object-cover transition-transform duration-300 md:group-hover:scale-105"
          />

          {/* 프로젝트 정보 (모바일에서만 표시) */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:hidden">
            <h3 className="line-clamp-1 text-xl font-bold text-white-base">
              {projectName}
            </h3>
            <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm text-white-base/90">
              {companyName} | {shortDescription}
            </p>
          </div>

          {/* 데스크톱 hover 시 오버레이 효과 */}
          <div className="absolute inset-0 hidden bg-black/0 transition-all duration-300 md:block md:group-hover:bg-black/10" />
        </div>

        {/* 프로젝트 상세 정보 섹션 - 2/5 비율 (md 이상에서만 표시) */}
        <div
          className="hidden h-full transition-all duration-300 md:col-span-2 md:block"
          style={{ backgroundColor: theme.background }}
        >
          <div className="flex h-full flex-col justify-between p-4">
            {/* 프로젝트 기본 정보 */}
            <div className="mb-3">
              <h3
                className="line-clamp-1 text-lg font-bold leading-tight transition-colors duration-300 md:group-hover:opacity-90"
                style={{ color: theme.text }}
              >
                {projectName}
              </h3>
              <p
                className="mt-1 text-sm transition-colors duration-300"
                style={{ color: theme.secondary }}
              >
                {companyName}
              </p>
              <p
                className="mt-1.5 line-clamp-2 min-h-[2rem] text-xs opacity-80 transition-colors duration-300"
                style={{ color: theme.text }}
              >
                {shortDescription}
              </p>
            </div>

            <ProjectRolesSection roles={roles} theme={theme} />
            <ProjectStacksSection stackIds={stackIds} theme={theme} />

            {/* 클릭 유도 힌트 */}
            <div className="flex items-center justify-end">
              <div
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs opacity-60 transition-all duration-300 md:group-hover:opacity-100"
                style={{
                  backgroundColor: theme.primary + "20",
                  color: theme.secondary,
                }}
              >
                <span>상세보기</span>
                <svg
                  className="h-3 w-3 transition-transform duration-300 md:group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default FullImageProjectCard;
