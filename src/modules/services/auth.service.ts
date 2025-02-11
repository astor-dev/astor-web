import { z } from "zod";
import type { HttpInstance } from "~modules/services/core/http.instance";

// AuthService 토큰 (DI용)
export const AUTH_SERVICE = Symbol("AUTH_SERVICE");

// 프로젝트 서비스 클래스
export class AuthService {
  // HTTP 인스턴스가 DI를 통해 주입됩니다.
  constructor(private http: HttpInstance) {}

  // 프로젝트 생성
  async verifyAuth(): Promise<boolean> {
    try {
      const response = await this.http.get("/auth/verify", {
        shape: {
          authenticated: z.boolean(),
        },
      });
      return response.authenticated;
    } catch (error) {
      console.error("인증 확인 실패:", error);
      return false;
    }
  }
}

// export class AuthService {
//   static async verifyAuth() {
//     try {
//       const response = await fetch(`${import.meta.env.API_URL}/auth/verify`, {
//         credentials: "include", // 쿠키 포함
//       });
//       return response.ok;
//     } catch (error) {
//       console.error("인증 확인 실패:", error);
//       return false;
//     }
//   }
// }
