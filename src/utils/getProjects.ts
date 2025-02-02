import { getCollection } from "astro:content";
import type {
  ProjectEntry,
  ProjectRole,
  ProjectType,
} from "~types/project.type";
import { isDefined, isEmptyArray } from "~utils/types.utils";

export interface GetProjectsOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    projectTypes?: ProjectType[];
    companyName?: string;
    projectName?: string;
    roles?: ProjectRole[];
    stackIds?: number[];
  };
  sort?: {
    field: "projectName" | "companyName" | "startedAt" | "endedAt";
    order: "asc" | "desc";
  };
}

export async function getProjects(
  options?: GetProjectsOptions,
): Promise<ProjectEntry[]> {
  let projects = await getCollection("projects");

  if (options?.filter) {
    const filter = options.filter;
    if (isDefined(filter.projectTypes) && !isEmptyArray(filter.projectTypes)) {
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
        filter.roles?.every(role => project.data.roles.includes(role)),
      );
    }
    if (isDefined(filter.stackIds)) {
      projects = projects.filter(project =>
        filter.stackIds?.every(stackId =>
          project.data.stackIds.includes(stackId),
        ),
      );
    }
  }

  if (options?.sort) {
    const sort = options.sort;
    projects = projects.sort((a, b) => {
      if (sort.field === "endedAt") {
        // endedAt이 ""인 경우 제일 앞으로 정렬
        if (sort.order === "asc") {
          if (a.data.endedAt === "") return -1;
          if (b.data.endedAt === "") return 1;
        } else {
          if (a.data.endedAt === "") return 1;
          if (b.data.endedAt === "") return -1;
        }
      }
      return sort.order === "asc"
        ? String(a.data[sort.field]).localeCompare(String(b.data[sort.field]))
        : String(b.data[sort.field]).localeCompare(String(a.data[sort.field]));
    });
  }

  if (isDefined(options?.paging)) {
    projects = projects.slice(
      options.paging.page * options.paging.limit,
      (options.paging.page + 1) * options.paging.limit,
    );
  }

  return projects;
}

// 단일 프로젝트 가져오기
export async function getProjectByName(
  name: string,
): Promise<ProjectEntry | undefined> {
  const projects = await getCollection("projects");
  return projects.find(
    (project: ProjectEntry) => project.data.projectName === name,
  );
}
