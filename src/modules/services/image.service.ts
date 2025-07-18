import { z } from "zod";
import type { ImageKey, ImageExtension } from "~common/types/image.type";
import type { HttpInstance } from "~modules/services/core/http.instance";

export const IMAGE_SERVICE = Symbol("IMAGE_SERVICE");

export class ImageService {
  constructor(private http: HttpInstance) {}

  async getPresignedUrl(key: ImageKey, extension: ImageExtension) {
    return await this.http.get(
      `/image/presigned-url?key=${key}&extension=${extension}`,
      {
        shape: {
          presignedUrl: z.string().url(),
          cdnUrl: z.string().url(),
        },
      },
    );
  }

  /**
   * 이미지 최적화를 위한 메서드
   * @param image 원본 이미지 파일
   * @param options 최적화 옵션
   * @returns 최적화된 이미지 파일
   */
  async optimizeImage(
    image: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: "jpeg" | "png" | "webp";
    } = {},
  ): Promise<File> {
    // 기본 옵션 설정
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = "webp",
    } = options;

    // SVG나 GIF는 최적화 대상에서 제외
    if (image.type === "image/svg+xml" || image.type === "image/gif") {
      return image;
    }

    // Canvas API를 사용한 이미지 최적화
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = function (e) {
        if (!e.target || typeof e.target.result !== "string") {
          reject(new Error("이미지 파일을 읽을 수 없습니다."));
          return;
        }

        img.src = e.target.result;
        img.onload = function () {
          // 이미지 크기 계산
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          // Canvas 생성 및 이미지 렌더링
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas 컨텍스트를 생성할 수 없습니다."));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // 최적화된 이미지 생성
          const mimeType =
            format === "webp"
              ? "image/webp"
              : format === "jpeg"
                ? "image/jpeg"
                : "image/png";

          canvas.toBlob(
            blob => {
              if (!blob) {
                reject(new Error("이미지를 최적화할 수 없습니다."));
                return;
              }

              // 새 파일 이름 생성
              const extension = format;
              const fileName = image.name.split(".")[0] + "." + extension;

              const optimizedFile = new File([blob], fileName, {
                type: mimeType,
              });
              resolve(optimizedFile);
            },
            mimeType,
            quality,
          );
        };

        img.onerror = function () {
          reject(new Error("이미지를 로드할 수 없습니다."));
        };
      };

      reader.onerror = function () {
        reject(new Error("파일을 읽을 수 없습니다."));
      };

      reader.readAsDataURL(image);
    });
  }

  async uploadImage(
    key: ImageKey,
    image: File,
    optimize: boolean = true,
    optimizeOptions = {},
  ) {
    if (!image.type.startsWith("image/")) {
      throw new Error("유효하지 않은 파일 타입입니다.");
    }

    try {
      // 이미지 최적화 적용 (SVG와 GIF는 제외)
      let fileToUpload = image;
      if (
        optimize &&
        image.type !== "image/svg+xml" &&
        image.type !== "image/gif"
      ) {
        fileToUpload = await this.optimizeImage(image, optimizeOptions);
      }

      const extension =
        fileToUpload.type === "image/svg+xml"
          ? "svg"
          : fileToUpload.type === "image/webp"
            ? "webp"
            : fileToUpload.type === "image/jpeg"
              ? "jpg"
              : fileToUpload.type === "image/png"
                ? "png"
                : fileToUpload.type === "image/gif"
                  ? "gif"
                  : fileToUpload.type.split("/").at(1);

      const presigned = await this.getPresignedUrl(
        key,
        extension as ImageExtension,
      );

      const { presignedUrl, cdnUrl } = presigned;
      const buffer = await fileToUpload.arrayBuffer();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileToUpload.type,
          "Content-Length": buffer.byteLength.toString(),
        },
        body: buffer,
      });

      return cdnUrl.toString();
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  }
}
