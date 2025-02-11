import { DependencyInjectionContainer } from "~modules/DependencyInjectionContainer";
import {
  POST_REPOSITORY,
  PostRepository,
} from "~modules/repositories/posts/PostRepository";
import {
  PROJECT_REPOSITORY,
  ProjectRepository,
} from "~modules/repositories/projects/ProjectRepository";

export const repositoryContainer = new DependencyInjectionContainer();

repositoryContainer.register(POST_REPOSITORY, PostRepository);
repositoryContainer.register(PROJECT_REPOSITORY, ProjectRepository);
