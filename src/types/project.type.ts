import type { CollectionEntry } from "astro:content";
import { z } from "zod";

export type ProjectEntry = CollectionEntry<"projects">;

export const ProjectTypeEnum = z.enum([
  "Toy-project",
  "Side-project",
  "Company-project",
]);
export type ProjectType = z.infer<typeof ProjectTypeEnum>;

export const ProjectRoleEnum = z.enum([
  "Frontend",
  "Backend",
  "Infra",
  "UI/UX",
  "Design",
  "Plan",
  "Etc",
]);
export type ProjectRole = z.infer<typeof ProjectRoleEnum>;
