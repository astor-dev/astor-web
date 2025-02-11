import type { CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export interface PostTitleAndId {
  id: string;
  title: string;
}

export interface Tag {
  tag: string;
  count: number;
}

export interface Series {
  series: string;
  ogImage: string;
  count: number;
}
