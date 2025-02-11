export interface GetPostsOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    tags?: string[];
    pinned?: boolean;
    draft?: boolean;
  };
  sort?: {
    by: "createdAt" | "updatedAt";
    order: "asc" | "desc";
  };
}
