import { getCollection } from "astro:content";
import type { PostEntry } from "~types/post.type";
import { isDefined } from "~utils/types.utils";

export interface GetPostsOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    tag?: string[];
    pinned?: boolean;
    draft?: boolean;
  };
  sort?: {
    by: "createdAt" | "updatedAt";
    order: "asc" | "desc";
  };
}

export interface TagAndCount {
  tag: string;
  count: number;
}

export interface PostData {}

export interface SeriesAndPosts {
  series: string;
  posts: PostEntry[];
}

export interface SeriesAndCounts {
  series: string;
  count: number;
}

// 모든 태그와 각 태그의 포스트 수를 가져오는 함수
export async function getAllTags(): Promise<TagAndCount[]> {
  const posts = await getCollection("posts");
  const tagCounts = posts
    .filter(post => !post.data.draft) // 공개된 포스트만 집계
    .reduce(
      (acc, post) => {
        post.data.tags.forEach(tag => {
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

export async function getAllSeries(): Promise<SeriesAndPosts[]> {
  const posts = await getCollection("posts");
  const seriesMap = new Map<string, PostEntry[]>();

  posts.forEach(post => {
    if (post.data.series) {
      seriesMap.set(post.data.series, [
        ...(seriesMap.get(post.data.series) || []),
        post,
      ]);
    }
  });

  return Array.from(seriesMap.entries()).map(([series, posts]) => ({
    series,
    posts,
  }));
}

export async function getAllSeriesAndCounts(): Promise<SeriesAndCounts[]> {
  const series = await getAllSeries();
  return series.map(s => ({
    series: s.series,
    count: s.posts.length,
  }));
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
    // draft 필터 적용 (기본값: false - 공개된 포스트만)
    if (isDefined(filter.draft)) {
      posts = posts.filter(post => post.data.draft === filter.draft);
    } else {
      posts = posts.filter(post => !post.data.draft);
    }
  }

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

  return posts;
}

// export async function getAllPostData(): Promise<PostEntry[]> {
// 단일 포스트 가져오기
export async function getPostById(id: string): Promise<PostEntry | undefined> {
  const posts = await getCollection("posts");
  return posts.find((post: PostEntry) => post.id === id);
}
