import { DependencyInjectionContainer } from "~modules/DependencyInjectionContainer";
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from "~modules/repositories/activities/ActivityRepository";
import {
  CAREER_REPOSITORY,
  CareerRepository,
} from "~modules/repositories/careers/CareerRepository";
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
repositoryContainer.register(ACTIVITY_REPOSITORY, ActivityRepository);
repositoryContainer.register(CAREER_REPOSITORY, CareerRepository);
