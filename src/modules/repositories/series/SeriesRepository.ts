import { getCollection } from "astro:content";
import type { GetProjectsOptions } from "~modules/repositories/projects/dto/GetProjects/GetProjectsOptions";
import type { Paginated } from "~types/page.type";
import type { ActivityEntry } from "~types/activity.type";
import { isDefined, isEmptyArray } from "~utils/types.utils";
import type { GetSeriesOptions } from "./dto/GetSeries/GetSeriesOptions";
import type { SeriesEntry } from "~types/series.type";
export const SERIES_REPOSITORY = Symbol("SERIES_REPOSITORY");

export class SeriesRepository {
  /**
   * 시리즈 목록을 가져옵니다.
   * @param options 필터, 정렬, 페이징 옵션
   */
  public async getSeries(
    options?: GetSeriesOptions,
  ): Promise<Paginated<SeriesEntry>> {
    let series = await getCollection("series");

    // 필터 적용
    if (options?.filter) {
      const filter = options.filter;
      if (isDefined(filter.name)) {
        series = series.filter(series => series.data.name === filter.name);
      }
      if (isDefined(filter.id)) {
        series = series.filter(series => series.data.id === filter.id);
      }
    }

    const total = series.length;

    // 정렬 적용
    if (options?.sort) {
      const sort = options.sort;
      series = series.sort((a, b) => {
        if (sort.field === "name") {
          if (sort.order === "asc") {
            if (a.data.name === "") return 1;
            if (b.data.name === "") return -1;
          } else {
            if (a.data.name === "") return -1;
            if (b.data.name === "") return 1;
          }
        }

        // 값이 같을 경우 id 기준 내림차순 정렬
        return String(a.data.id).localeCompare(String(b.data.id));
      });
    }

    // 페이징 적용
    if (isDefined(options?.paging)) {
      series = series.slice(
        options.paging.page * options.paging.limit,
        (options.paging.page + 1) * options.paging.limit,
      );
    }

    return {
      items: series,
      total,
      page: options?.paging?.page ?? 1,
      limit: options?.paging?.limit ?? total,
    };
  }

  /**
   * 활동 이름으로 단일 활동을 가져옵니다.
   * @param name 활동 이름
   */
  public async getSeriesByName(name: string): Promise<SeriesEntry | undefined> {
    const series = await getCollection("series");
    return series.find(series => series.data.name === name);
  }

  public async getSeriesById(id: string): Promise<SeriesEntry | undefined> {
    const series = await getCollection("series");
    return series.find(series => series.data.id === id);
  }
}
