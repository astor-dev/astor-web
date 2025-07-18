import { file, glob } from "astro/loaders";

import { z } from "zod";
import { defineCollection } from "astro:content";
import { ProjectTypeEnum, ProjectRoleEnum } from "~common/types/project.type";
import { stackTypeEnum } from "~common/types/stack.type";

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
    stack: z.array(
      z.object({
        type: stackTypeEnum,
        id: z.number(),
      }),
    ),
    primaryColor: z.string().nullable(),
    backgroundColor: z.string().nullable(),
  }),
});

const posts = defineCollection({
  type: "content_layer",
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      id: z.string(),
      author: z.string().default("Astor"),
      createdAt: z.string(),
      updatedAt: z.string(),
      title: z.string(),
      pinned: z.boolean().default(false),
      draft: z.boolean().default(true),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.string(),
      seriesId: z.string().optional(),
    }),
});

const activities = defineCollection({
  // type: "data",
  loader: file("src/content/activities/activities.json"),
  schema: z.object({
    id: z.number(),
    role: z.string(),
    organizationName: z.string(),
    startedAt: z.string(),
    endedAt: z.string().nullable(),
    body: z.array(
      z.object({
        heading: z.string(),
        description: z.string().nullable(),
        lists: z.array(z.string()),
      }),
    ),
    relatedProjectNames: z.array(z.string()),
  }),
});

const careers = defineCollection({
  // type: "data",
  loader: file("src/content/careers/careers.json"),
  schema: z.object({
    id: z.number(),
    role: z.string(),
    organizationName: z.string(),
    startedAt: z.string(),
    endedAt: z.string().nullable(),
    body: z.array(
      z.object({
        heading: z.string(),
        description: z.string().nullable(),
        lists: z.array(z.string()),
      }),
    ),
    relatedProjectNames: z.array(z.string()),
  }),
});

const series = defineCollection({
  loader: file("src/content/series/series.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    ogImage: z.string(),
  }),
});

// 사용할 컬렉션만 명시적으로 export
export const collections = {
  projects,
  posts,
  activities,
  careers,
  series,
};
