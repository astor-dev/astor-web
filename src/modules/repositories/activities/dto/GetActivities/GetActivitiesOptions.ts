export interface GetActivitiesOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    role?: string;
  };
  sort?: {
    field: "organizationName" | "startedAt" | "endedAt";
    order: "asc" | "desc";
  };
}
