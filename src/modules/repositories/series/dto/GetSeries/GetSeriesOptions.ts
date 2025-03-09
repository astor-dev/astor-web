export interface GetSeriesOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    name?: string;
  };
  sort?: {
    field: "name";
    order: "asc" | "desc";
  };
}
