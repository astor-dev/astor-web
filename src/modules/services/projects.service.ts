import type { HttpInstance } from "~modules/services/core/http.instance";
import type { ProjectRole, ProjectType } from "~types/project.type";

export const PROJECTS_SERVICE = Symbol("PROJECTS_SERVICE");

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
    primaryColor: string | null;
    backgroundColor: string | null;
  };
  body: string;
}

// 프로젝트 서비스 클래스
export class ProjectsService {
  constructor(private http: HttpInstance) {}

  // 프로젝트 생성
  async createProject(project: CreateProjectRequest) {
    return await this.http.put("/projects", project);
  }
}
