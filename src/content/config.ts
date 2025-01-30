import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { ProjectRoleEnum, ProjectTypeEnum } from "~types/project.type";

// 프로젝트 컬렉션 스키마 정의
const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    projectType: ProjectTypeEnum,
    imageUrl: z.string(),
    siteUrl: z.string().url(),
    roles: z.array(ProjectRoleEnum),
    companyName: z.string(),
    projectName: z.string(),
    shortDescription: z.string(),
    startedAt: z.string(),
    endedAt: z.string(),
    stackIds: z.array(z.number()),
  }),
});

// 사용할 컬렉션만 명시적으로 export
export const collections = {
  projects: projects, // 현재는 projects 컬렉션만 사용
};
