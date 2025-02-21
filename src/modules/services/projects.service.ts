import { z } from "zod";
import type { HttpInstance } from "~modules/services/core/http.instance";
import type { ProjectRole, ProjectType } from "~types/project.type";

export const PROJECTS_SERVICE = Symbol("PROJECTS_SERVICE");

const ProjectCreateSchema = {
  data: z.object({
    frontmatter: z.object({
      projectType: z.string() as z.ZodType<ProjectType>,
      imageUrl: z.string(),
      siteUrl: z.string(),
      roles: z.array(z.string() as z.ZodType<ProjectRole>),
      companyName: z.string(),
      projectName: z.string(),
      shortDescription: z.string(),
      startedAt: z.string(),
      endedAt: z.string(),
      stackIds: z.array(z.number()),
    }),
    body: z.string(),
  }),
};

// 프로젝트 생성 요청 타입
interface CreateProjectRequest {
  frontmatter: {
    projectType: ProjectType;
    imageUrl: string;
    siteUrl: string;
    roles: ProjectRole[];
    companyName: string;
    projectName: string;
    shortDescription: string;
    startedAt: string;
    endedAt?: string;
    stackIds: number[];
  };
  body: string;
}

// 프로젝트 서비스 클래스
export class ProjectsService {
  constructor(private http: HttpInstance) {}

  // 프로젝트 생성
  async createProject(project: CreateProjectRequest) {
    console.log(project);
    return await this.http.put("/projects", project);
  }
}
