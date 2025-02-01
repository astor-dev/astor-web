import type { P } from "node_modules/@storybook/react/dist/public-types-8dd0ccdf";
import { z } from "zod";
import { instance } from "~services/core/config";
import type { ProjectRole, ProjectType } from "~types/project.type";
import type { AstroGlobal } from "astro";

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
    endedAt: string;
    stackIds: number[];
  };
  body: string;
}

// 프로젝트 서비스 클래스
export class ProjectsService {
  // 프로젝트 생성
  static async createProject(project: CreateProjectRequest) {
    return await instance.post("/projects", project, {
      shape: ProjectCreateSchema,
    });
  }
}
