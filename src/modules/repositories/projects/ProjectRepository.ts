import { getCollection } from "astro:content";
import dayjs from "dayjs";
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
        const sortWeight = sort.order === "asc" ? 1 : -1;

        if (sort.field === "endedAt") {
          // endedAt 필드가 빈 값인 경우 내림차순 시 제일 앞으로 (둘 다 ""이 아닌 경우만)
          if (
            (a.data.endedAt === "" || b.data.endedAt === "") &&
            a.data.endedAt !== b.data.endedAt
          ) {
            if (a.data.endedAt === "") {
              return 1 * sortWeight;
            }
            if (b.data.endedAt === "") {
              return -1 * sortWeight;
            }
          } else if (a.data.endedAt !== "" && b.data.endedAt !== "") {
            const diff = dayjs(a.data.endedAt).diff(dayjs(b.data.endedAt));
            if (diff !== 0) return diff * sortWeight;
          }
        }

        // diff가 0인경 우의 정렬 기준
        // Project Type은 Company-project -> Side-project -> Toy-project 순으로 정렬
        const projectTypeOrder = {
          "Company-project": 0,
          "Side-project": 1,
          "Toy-project": 2,
        };
        const compareResult =
          projectTypeOrder[a.data.projectType] -
          projectTypeOrder[b.data.projectType];

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
