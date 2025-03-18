export interface GetActivitiesOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    role?: string;
  };
  sort?: {
    field: "startedAt" | "endedAt";
    order: "asc" | "desc";
  };
}
