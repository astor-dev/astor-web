import { getCollection } from "astro:content";
import type { GetPostsOptions } from "~modules/repositories/posts/dto/GetPosts/GetPostsOptions";
import type { Paginated } from "~types/page.type";
import type { PostEntry, PostTitleAndId, Series, Tag } from "~types/post.type";
import { isDefined } from "~utils/types.utils";

export const POST_REPOSITORY = Symbol("POST_REPOSITORY");

export class PostRepository {
  /**
   * 포스트 목록을 가져옵니다.
   * @param options 필터, 정렬, 페이징 옵션
   */
  public async getPosts(
    options?: GetPostsOptions,
  ): Promise<Paginated<PostEntry>> {
    let posts = await getCollection("posts");

    // 필터 적용
    if (options?.filter) {
      const filter = options.filter;
      if (isDefined(filter.tags)) {
        posts = posts.filter(post =>
          filter.tags!.every(tag => post.data.tags.includes(tag)),
        );
      }
      if (isDefined(filter.pinned)) {
        posts = posts.filter(post => post.data.pinned === filter.pinned);
      }
      // draft 필터 (기본값: 공개된 포스트만)
      if (isDefined(filter.draft)) {
        posts = posts.filter(post => post.data.draft === filter.draft);
      } else {
        posts = posts.filter(post => !post.data.draft);
      }
    }

    // 필터만 적용한 전체 포스트 수 계산
    const total = posts.length;

    // 정렬 적용
    if (options?.sort) {
      posts = posts.sort((a, b) => {
        const aDate = new Date(a.data[options.sort!.by]).getTime();
        const bDate = new Date(b.data[options.sort!.by]).getTime();
        return options.sort!.order === "desc" ? bDate - aDate : aDate - bDate;
      });
    } else {
      // 기본 정렬: 작성일 기준 내림차순
      posts = posts.sort(
        (a, b) =>
          new Date(b.data.createdAt).getTime() -
          new Date(a.data.createdAt).getTime(),
      );
    }

    // 페이징 적용
    if (isDefined(options?.paging)) {
      posts = posts.slice(
        (options.paging.page - 1) * options.paging.limit,
        options.paging.page * options.paging.limit,
      );
    }

    return {
      items: posts,
      total,
      page: options?.paging?.page || 1,
      limit: options?.paging?.limit || total,
    };
  }

  /**
   * 모든 태그와 각 태그의 포스트 수를 가져옵니다.
   */
  public async getAllTags(): Promise<Tag[]> {
    const posts = await getCollection("posts");

    const tagCounts = posts
      .filter(post => !post.data.draft)
      .reduce(
        (acc, post) => {
          post.data.tags.forEach((tag: string) => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>,
      );

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }

  /**
   * 모든 시리즈와 각 시리즈의 포스트 수를 가져옵니다.
   */
  public async getAllSeries(): Promise<Series[]> {
    const posts = await this.getPosts({
      sort: { by: "createdAt", order: "asc" },
    });
    const seriesInfo = posts.items.reduce(
      (acc, post) => {
        if (post.data.series) {
          if (!acc[post.data.series]) {
            acc[post.data.series] = {
              count: 0,
              ogImage: post.data.ogImage,
            };
          }
          acc[post.data.series].count += 1;
        }
        return acc;
      },
      {} as Record<string, { count: number; ogImage: string }>,
    );

    return Object.entries(seriesInfo)
      .map(([series, info]) => ({
        series,
        count: info.count,
        ogImage: info.ogImage,
      }))
      .sort((a, b) => b.count - a.count);
  }

  public async getAllPostTitleAndId(): Promise<PostTitleAndId[]> {
    const posts = await getCollection("posts");
    return posts.map(post => ({ id: post.id, title: post.data.title }));
  }

  /**
   * 단일 포스트를 ID로 가져옵니다.
   * @param id 포스트 ID
   */
  public async getPostById(id: string): Promise<PostEntry | undefined> {
    const posts = await getCollection("posts");
    return posts.find((post: PostEntry) => post.id === id);
  }
}
