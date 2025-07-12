import type { HttpInstance } from "~modules/services/core/http.instance";

export const SERIES_SERVICE = Symbol("SERIES_SERVICE");

interface SaveSeriesRequest {
  id: string;
  name: string;
  ogImage: string;
}

export class SeriesService {
  constructor(private http: HttpInstance) {}

  async saveAllSeries(seriesData: SaveSeriesRequest[]): Promise<void> {
    await this.http.put("/series", { series: seriesData });
  }
}
