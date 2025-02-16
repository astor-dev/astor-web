import { getCollection } from "astro:content";
import type { GetProjectsOptions } from "~modules/repositories/projects/dto/GetProjects/GetProjectsOptions";
import type { Paginated } from "~types/page.type";
import type {
  ProjectEntry,
  ProjectRole,
  ProjectType,
} from "~types/project.type";
import { isDefined, isEmptyArray } from "~utils/types.utils";

export const PROJECT_REPOSITORY = Symbol("PROJECT_REPOSITORY");

export class ProjectRepository {
  /**
   * 프로젝트 목록을 가져옵니다.
   * @param options 필터, 정렬, 페이징 옵션
   */
  public async getProjects(
    options?: GetProjectsOptions,
  ): Promise<Paginated<ProjectEntry>> {
    let projects = await getCollection("projects");

    // 필터 적용
    if (options?.filter) {
      const filter = options.filter;
      if (
        isDefined(filter.projectTypes) &&
        !isEmptyArray(filter.projectTypes)
      ) {
        projects = projects.filter(project =>
          filter.projectTypes!.includes(project.data.projectType),
        );
      }
      if (isDefined(filter.companyName)) {
        projects = projects.filter(
          project => project.data.companyName === filter.companyName,
        );
      }
      if (isDefined(filter.projectName)) {
        projects = projects.filter(
          project => project.data.projectName === filter.projectName,
        );
      }
      if (isDefined(filter.roles)) {
        projects = projects.filter(project =>
          filter.roles!.every(role => project.data.roles.includes(role)),
        );
      }
      if (isDefined(filter.stackIds)) {
        projects = projects.filter(project =>
          filter.stackIds!.every(stackId =>
            project.data.stackIds.includes(stackId),
          ),
        );
      }
    }

    const total = projects.length;

    // 정렬 적용
    if (options?.sort) {
      const sort = options.sort;
      projects = projects.sort((a, b) => {
        if (sort.field === "endedAt") {
          // endedAt 필드가 빈 값인 경우 내림차순 시 제일 앞으로
          if (sort.order === "asc") {
            if (a.data.endedAt === "") return 1;
            if (b.data.endedAt === "") return -1;
          } else {
            if (a.data.endedAt === "") return -1;
            if (b.data.endedAt === "") return 1;
          }
        }

        // 값이 같을 경우 projectName 기준 가나다순 정렬
        const compareResult =
          sort.order === "asc"
            ? String(a.data[sort.field]).localeCompare(
                String(b.data[sort.field]),
              )
            : String(b.data[sort.field]).localeCompare(
                String(a.data[sort.field]),
              );

        if (compareResult === 0) {
          return String(a.data.projectName).localeCompare(
            String(b.data.projectName),
          );
        }
        return compareResult;
      });
    }

    // 페이징 적용
    if (isDefined(options?.paging)) {
      projects = projects.slice(
        options.paging.page * options.paging.limit,
        (options.paging.page + 1) * options.paging.limit,
      );
    }

    return {
      items: projects,
      total,
      page: options?.paging?.page ?? 1,
      limit: options?.paging?.limit ?? total,
    };
  }

  /**
   * 프로젝트 이름으로 단일 프로젝트를 가져옵니다.
   * @param name 프로젝트 이름
   */
  public async getProjectByName(
    name: string,
  ): Promise<ProjectEntry | undefined> {
    const projects = await getCollection("projects");
    return projects.find(
      (project: ProjectEntry) => project.data.projectName === name,
    );
  }
}
