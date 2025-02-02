import { z } from "zod";
import { instance } from "~services/core/config";

// 프로젝트 서비스 클래스
export class AuthService {
  // 프로젝트 생성
  static async verifyAuth(): Promise<boolean> {
    try {
      const response = await instance.get("/auth/verify", {
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
