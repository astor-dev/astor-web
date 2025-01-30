import { getCollection } from "astro:content";
import type { PostEntry } from "~types/post.type";
import { isDefined } from "~utils/types.utils";

export interface GetPostsOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter: {
    tag?: string[];
    pinned?: boolean;
  };
}

export async function getPosts(
  options?: GetPostsOptions,
): Promise<PostEntry[]> {
  let posts = await getCollection("posts");

  // 필터 적용
  if (options?.filter) {
    const filter = options.filter;
    if (isDefined(filter.tag)) {
      posts = posts.filter(post =>
        filter.tag?.every(tag => post.data.tags.includes(tag)),
      );
    }
    if (isDefined(filter.pinned)) {
      posts = posts.filter(post => post.data.pinned === filter.pinned);
    }
  }

  // 페이징 적용
  if (isDefined(options?.paging)) {
    posts = posts.slice(
      options.paging.page * options.paging.limit,
      (options.paging.page + 1) * options.paging.limit,
    );
  }

  return posts;
}

// 단일 프로젝트 가져오기
export async function getPostById(id: string): Promise<PostEntry | undefined> {
  const posts = await getCollection("posts");
  return posts.find((post: PostEntry) => post.id === id);
}
