import { getCollection } from "astro:content";
import type { Paginated } from "~types/page.type";
import type { CareerEntry } from "~types/career.type";
import { isDefined, isEmptyArray } from "~utils/types.utils";
import type { GetCareersOptions } from "./dto/GetCareers/GetCareersOptions";

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
        if (sort.field === "organizationName") {
          // organizationName 필드가 빈 값인 경우 내림차순 시 제일 앞으로
          if (sort.order === "asc") {
            if (a.data.organizationName === "") return 1;
            if (b.data.organizationName === "") return -1;
          } else {
            if (a.data.organizationName === "") return -1;
            if (b.data.organizationName === "") return 1;
          }
        }
        if (sort.field === "startedAt") {
          return a.data.startedAt.localeCompare(b.data.startedAt);
        }
        if (sort.field === "endedAt") {
          // null인 값은 최신으로 가장 앞
          if (a.data.endedAt === null) return -1;
          if (b.data.endedAt === null) return 1;
          return a.data.endedAt.localeCompare(b.data.endedAt);
        }

        // 값이 같을 경우 projectName 기준 가나다순 정렬
        const compareResult =
          sort.order === "asc"
            ? String(a.data[sort.field]).localeCompare(
                String(b.data[sort.field]),
              )
            : String(b.data[sort.field]).localeCompare(
                String(a.data[sort.field]),
              );

        if (compareResult === 0) {
          return String(a.data.organizationName).localeCompare(
            String(b.data.organizationName),
          );
        }
        return compareResult;
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
