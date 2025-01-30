/* eslint-disable @typescript-eslint/no-explicit-any */

import replacer from "~services/core/replacer";
import { z } from "zod";
import { getAccessToken, logout } from "~services/core/auth";
import type { AstroGlobal } from "astro";
import { silentParse } from "~services/core/parser";
import { AstorError } from "~services/core/Error";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const BASE_URL = process.env.ASTOR_API_URL;

const emptyShape = {};
type EmptyShape = typeof emptyShape;

interface RequestInitWithSchema<O extends z.ZodRawShape> extends RequestInit {
  shape?: O;
}
const ApiResponseOkSchema = <T extends z.ZodRawShape>(rawShape: T) =>
  z
    .object({ ok: z.literal(true), statusCode: z.number() })
    .merge(z.object(rawShape))
    .strict();

class Instance {
  constructor(private readonly baseUrl: string = BASE_URL ?? "") {}

  async fetchWithConfig<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    method: HttpMethod,
    body?: any,
    options: RequestInitWithSchema<T> = {},
  ) {
    const { shape, ...pure } = options;

    const schema = shape
      ? ApiResponseOkSchema(shape)
      : // NOTE this `as T` is safe because `shape` is undefined
        ApiResponseOkSchema(emptyShape as T);

    const config: RequestInit = {
      method,
      cache: "no-store",
      ...pure,
      headers: {
        "Content-Type": "application/json",
        ...pure?.headers,
      },
      ...(body && { body: JSON.stringify(body, replacer) }),
    };

    const res = await fetch(new URL(url, this.baseUrl).toString(), config);

    // response가 없는 경우
    if (res.statusText === "No Content") {
      if (res.status >= 400) {
        throw new AstorError(res.status, "No Content");
      }
      return silentParse(
        schema,
        {
          ok: true,
          statusCode: res.status,
        },
        `${url}에 대한 응답이 실패했습니다.`,
      );
    }
    // response가 있는 경우
    const data = await res.json();
    if (!data.ok) {
      throw new AstorError(
        data.statusCode,
        data.error?.message || "알 수 없는 오류",
      );
    }
    return silentParse(
      schema,
      data,
      `${url}에 대한 응답이 실패했습니다. : ${data}`,
    );
  }

  async get<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.fetchWithConfig<T>(url, "GET", undefined, options);
  }
  async delete<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body?: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, "DELETE", body, options);
  }
  async post<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, "POST", body, options);
  }
  async put<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, "PUT", body, options);
  }
  async patch<T extends z.ZodRawShape = EmptyShape>(
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return await this.fetchWithConfig<T>(url, "PATCH", body, options);
  }
}

export const instance = new Instance();

class AuthInstance {
  async authFetchWithConfig<T extends z.ZodRawShape = EmptyShape>(
    Astro: AstroGlobal,
    url: string,
    method: HttpMethod,
    body?: unknown,
    options: RequestInit = {},
  ) {
    const accessToken = getAccessToken(Astro);
    const authOptions: RequestInitWithSchema<T> = {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    };

    try {
      return await instance.fetchWithConfig<T>(url, method, body, authOptions);
    } catch (e) {
      const error = e as AstorError;
      const isServer = typeof window === "undefined";
      if (error.statusCode === 401 && !isServer) {
        console.error("로그인 시간 만료: ", error.message);
        logout(Astro);
      }
      throw error;
    }
  }

  async get<T extends z.ZodRawShape = EmptyShape>(
    Astro: AstroGlobal,
    url: string,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(Astro, url, "GET", undefined, options);
  }
  async delete<T extends z.ZodRawShape = EmptyShape>(
    Astro: AstroGlobal,
    url: string,
    body?: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(Astro, url, "DELETE", body, options);
  }

  async post<T extends z.ZodRawShape = EmptyShape>(
    Astro: AstroGlobal,
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(Astro, url, "POST", body, options);
  }
  async put<T extends z.ZodRawShape = EmptyShape>(
    Astro: AstroGlobal,
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(Astro, url, "PUT", body, options);
  }

  async patch<T extends z.ZodRawShape = EmptyShape>(
    Astro: AstroGlobal,
    url: string,
    body: any,
    options?: RequestInitWithSchema<T>,
  ) {
    return this.authFetchWithConfig<T>(Astro, url, "PATCH", body, options);
  }
}

export const authInstance = new AuthInstance();

// ----- utility for shape option -----

type PaginatedResponse<Shape extends z.ZodRawShape> = Shape & {
  totalCount: z.ZodNumber;
  nextPage: z.ZodNullable<z.ZodString>;
};

// limit이 없을 경우 전체 데이터 조회
export const withPagination = <Shape extends z.ZodRawShape>(
  shape: Shape,
): PaginatedResponse<Shape> =>
  ({
    ...shape,
    totalCount: z.number(),
    nextPage: z.string().nullable(),
  }) satisfies PaginatedResponse<Shape>;
