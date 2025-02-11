import { glob } from "astro/loaders";
import { ProjectRoleEnum, ProjectTypeEnum } from "~types/project.type";
import { z } from "zod";
import { defineCollection } from "astro:content";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    projectType: ProjectTypeEnum,
    imageUrl: z.string(),
    siteUrl: z.string().url().or(z.literal("")),
    roles: z.array(ProjectRoleEnum),
    companyName: z.string(),
    projectName: z.string(),
    shortDescription: z.string(),
    startedAt: z.string(),
    endedAt: z.string(), // ""의 경우 현재 진행중인 프로젝트
    stackIds: z.array(z.number()),
  }),
});

const posts = defineCollection({
  type: "content_layer",
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      author: z.string().default("Astor"),
      createdAt: z.string(),
      updatedAt: z.string(),
      title: z.string(),
      pinned: z.boolean().default(false),
      draft: z.boolean().default(true),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.string(),
      series: z.string().optional(),
      description: z.string(),
    }),
});

// 사용할 컬렉션만 명시적으로 export
export const collections = {
  projects,
  posts,
};
