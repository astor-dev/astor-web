import { getCollection } from "astro:content";
import type { GetProjectsOptions } from "~modules/repositories/projects/dto/GetProjects/GetProjectsOptions";
import type { Paginated } from "~types/page.type";
import type { ActivityEntry } from "~types/activity.type";
import { isDefined, isEmptyArray } from "~utils/types.utils";
import type { GetActivitiesOptions } from "./dto/GetActivities/GetActivitiesOptions";
export const ACTIVITY_REPOSITORY = Symbol("ACTIVITY_REPOSITORY");

export class ActivityRepository {
  /**
   * 프로젝트 목록을 가져옵니다.
   * @param options 필터, 정렬, 페이징 옵션
   */
  public async getActivities(
    options?: GetActivitiesOptions,
  ): Promise<Paginated<ActivityEntry>> {
    let activities = await getCollection("activities");

    // 필터 적용
    if (options?.filter) {
      const filter = options.filter;
      if (isDefined(filter.role)) {
        activities = activities.filter(
          activity => activity.data.role === filter.role,
        );
      }
    }

    const total = activities.length;

    // 정렬 적용
    if (options?.sort) {
      const sort = options.sort;
      activities = activities.sort((a, b) => {
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
      activities = activities.slice(
        options.paging.page * options.paging.limit,
        (options.paging.page + 1) * options.paging.limit,
      );
    }

    return {
      items: activities,
      total,
      page: options?.paging?.page ?? 1,
      limit: options?.paging?.limit ?? total,
    };
  }

  /**
   * 활동 이름으로 단일 활동을 가져옵니다.
   * @param name 활동 이름
   */
  public async getActivityByName(
    name: string,
  ): Promise<ActivityEntry | undefined> {
    const activities = await getCollection("activities");
    return activities.find(
      (activity: ActivityEntry) => activity.data.organizationName === name,
    );
  }
}
