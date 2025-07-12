import { getCollection } from "astro:content";
import type { Paginated } from "~common/types/page.type";
import type { CareerEntry } from "~common/types/career.type";
import { isDefined } from "~common/utils/types.utils";
import type { GetCareersOptions } from "~modules/repositories/careers/dto/GetCareers/GetCareersOptions";

export const CAREER_REPOSITORY = Symbol("CAREER_REPOSITORY");

export class CareerRepository {
  /**
   * 프로젝트 목록을 가져옵니다.
   * @param options 필터, 정렬, 페이징 옵션
   */
  public async getCareers(
    options?: GetCareersOptions,
  ): Promise<Paginated<CareerEntry>> {
    let careers = await getCollection("careers");

    // 필터 적용
    if (options?.filter) {
      const filter = options.filter;
      if (isDefined(filter.role)) {
        careers = careers.filter(career => career.data.role === filter.role);
      }
    }

    const total = careers.length;

    // 정렬 적용
    if (options?.sort) {
      const sort = options.sort;
      careers = careers.sort((a, b) => {
        const sortWeight = sort.order === "asc" ? 1 : -1;

        if (sort.field === "startedAt") {
          return a.data.startedAt.localeCompare(b.data.startedAt) * sortWeight;
        }
        if (sort.field === "endedAt") {
          // null인 값은 최신으로 가장 앞
          if (a.data.endedAt === null && b.data.endedAt === null) {
            if (a.data.endedAt === b.data.endedAt) {
              return (
                a.data.startedAt.localeCompare(b.data.startedAt) * sortWeight
              );
            }

            return (
              a.data.startedAt.localeCompare(b.data.startedAt) * sortWeight
            );
          }
          if (a.data.endedAt === null) return sortWeight;
          if (b.data.endedAt === null) return -sortWeight;
        }

        return (
          a.data.organizationName.localeCompare(b.data.organizationName) *
          sortWeight
        );
      });
    }

    // 페이징 적용
    if (isDefined(options?.paging)) {
      careers = careers.slice(
        options.paging.page * options.paging.limit,
        (options.paging.page + 1) * options.paging.limit,
      );
    }

    return {
      items: careers,
      total,
      page: options?.paging?.page ?? 1,
      limit: options?.paging?.limit ?? total,
    };
  }

  /**
   * 활동 이름으로 단일 활동을 가져옵니다.
   * @param name 활동 이름
   */
  public async getCareerByName(name: string): Promise<CareerEntry | undefined> {
    const careers = await getCollection("careers");
    return careers.find(
      (career: CareerEntry) => career.data.organizationName === name,
    );
  }
}
