import type { ProjectType, ProjectRole } from "~common/types/project.type";

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
