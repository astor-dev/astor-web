import type { Dayjs } from "dayjs";

export interface GetPostsOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    tags?: string[];
    pinned?: boolean;
    draft?: boolean;
    seriesId?: string;
    createdAt?: {
      $gte?: Dayjs;
      $lte?: Dayjs;
    };
  };
  sort?: {
    by: "createdAt" | "updatedAt";
    order: "asc" | "desc";
  };
}
