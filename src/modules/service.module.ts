import { DependencyInjectionContainer } from "~modules/dependency-injection-container";
// AuthService는 httpInstance를 생성자에 주입받도록 변경된 구현체
import { AUTH_SERVICE, AuthService } from "~modules/services/auth.service";
import {
  HTTP_INSTANCE,
  HttpInstance,
} from "~modules/services/core/http.instance";
import { IMAGE_SERVICE, ImageService } from "~modules/services/image.service";
import { POSTS_SERVICE, PostsService } from "~modules/services/posts.service";
import {
  PROJECTS_SERVICE,
  ProjectsService,
} from "~modules/services/projects.service";
import {
  SERIES_SERVICE,
  SeriesService,
} from "~modules/services/series.service";

// DI 컨테이너 생성
export const serviceContainer = new DependencyInjectionContainer();

serviceContainer.registerInstance(HTTP_INSTANCE, new HttpInstance());
serviceContainer.registerWithDependencies(AUTH_SERVICE, AuthService, [
  HTTP_INSTANCE,
]);
serviceContainer.registerWithDependencies(PROJECTS_SERVICE, ProjectsService, [
  HTTP_INSTANCE,
]);
serviceContainer.registerWithDependencies(IMAGE_SERVICE, ImageService, [
  HTTP_INSTANCE,
]);
serviceContainer.registerWithDependencies(POSTS_SERVICE, PostsService, [
  HTTP_INSTANCE,
]);
serviceContainer.registerWithDependencies(SERIES_SERVICE, SeriesService, [
  HTTP_INSTANCE,
]);
