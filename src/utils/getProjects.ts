import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;

export async function getProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection("projects");
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
