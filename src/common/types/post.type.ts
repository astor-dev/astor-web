import type { CollectionEntry } from "astro:content";
import type { SeriesEntry } from "~common/types/series.type";

export type PostEntry = CollectionEntry<"posts">;

export interface PostTitleAndId {
  id: string;
  title: string;
}

export interface SeriesAndCount {
  series: SeriesEntry;
  count: number;
}

export interface SeriesAndPosts {
  series: SeriesEntry;
  posts: PostEntry[];
}

export interface Tag {
  tag: string;
  count: number;
}
