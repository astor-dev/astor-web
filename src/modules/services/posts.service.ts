import type { HttpInstance } from "~modules/services/core/http.instance";

export const POSTS_SERVICE = Symbol("POSTS_SERVICE");

interface CreatePostRequest {
  frontmatter: {
    id: string;
    author: string;
    title: string;
    pinned: boolean;
    draft: boolean;
    tags: string[];
    ogImage: string;
    seriesId: string;
    createdAt: string;
    updatedAt: string;
  };
  body: string;
}

export class PostsService {
  constructor(private http: HttpInstance) {}

  // 포스트 생성
  async createPost(post: CreatePostRequest) {
    return await this.http.put("/posts", post);
  }
}
