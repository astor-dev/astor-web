import { z } from "zod";
import type { HttpInstance } from "~modules/services/core/http.instance";

export const POSTS_SERVICE = Symbol("POSTS_SERVICE");

// ✅ Zod 스키마 정의
const PostCreateSchema = z.object({
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
    }),
    body: z.string(),
  }),
});

// ✅ 스키마를 기반으로 타입 추론
type PostCreateType = z.infer<typeof PostCreateSchema>;

export class PostsService {
  constructor(private http: HttpInstance) {}

  // 포스트 생성
  async createPost(post: PostCreateType) {
    return await this.http.put("/posts", post, {
      shape: PostCreateSchema.shape.data.shape,
    });
  }
}
