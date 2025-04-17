export interface GetSeriesOptions {
  paging?: {
    page: number;
    limit: number;
  };
  filter?: {
    name?: string;
    id?: string;
  };
  sort?: {
    field: "name";
    order: "asc" | "desc";
  };
}
