import { z } from "zod";
import type { HttpInstance } from "~modules/services/core/http.instance";

export const POSTS_SERVICE = Symbol("POSTS_SERVICE");

// ✅ Zod 스키마 정의
const PostCreateSchema = {
  data: z.object({
    frontmatter: z.object({
      author: z.string(),
      title: z.string(),
      pinned: z.boolean(),
      draft: z.boolean(),
      tags: z.array(z.string()),
      ogImage: z.string(),
      series: z.string(),
      description: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    body: z.string(),
  }),
};

interface CreatePostRequest {
  frontmatter: {
    author: string;
    title: string;
    pinned: boolean;
    draft: boolean;
    tags: string[];
    ogImage: string;
    series: string;
    description: string;
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
