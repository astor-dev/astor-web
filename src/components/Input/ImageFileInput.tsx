import React, { useEffect, useRef, useState } from "react";
import {
  RiImageAddFill,
  RiCheckFill,
  RiLoader2Fill,
  RiClipboardLine,
} from "react-icons/ri";
import { serviceContainer } from "~modules/service.module";
import {
  IMAGE_SERVICE,
  type ImageService,
} from "~modules/services/image.service";
import type { ImageKey } from "~types/image.type";

interface Props {
  id: string;
  name: string;
  label: string;
  type: ImageKey;
  required?: boolean;
  value?: string;
  setValue: (value: string | undefined) => void;
}

const ImageFileInput: React.FC<Props> = ({
  id,
  name,
  label,
  type,
  required = false,
  value,
  setValue,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageService = serviceContainer.get<ImageService>(IMAGE_SERVICE);

  const isLoading = file !== null;
  const isPending = !value && !previewUrl;
  const displayUrl = previewUrl || value;

  // 클립보드 이미지 처리 함수
  const handlePaste = (e: ClipboardEvent) => {
    if (isLoading) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          setFile(blob);
          e.preventDefault();
          break;
        }
      }
    }
  };

  // 클립보드 내용 직접 가져오기
  const getClipboardContents = async () => {
    if (isLoading) return;

    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        // 이미지 타입 검색
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            // 파일 형식으로 변환
            const fileExt = type.split("/")[1] || "png";
            const filename = `pasted-image.${fileExt}`;
            const file = new File([blob], filename, { type });
            setFile(file);
            return;
          }
        }
      }
    } catch (err) {
      console.error("클립보드 내용을 가져오는 중 오류 발생:", err);
      alert(
        "클립보드 접근에 실패했습니다. 이미지를 직접 선택하거나 Ctrl+V를 사용해주세요.",
      );
    }
  };

  // 클립보드 이벤트 리스너 등록/해제
  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.addEventListener("paste", handlePaste);
    } else {
      document.addEventListener("paste", handlePaste);
    }

    return () => {
      if (element) {
        element.removeEventListener("paste", handlePaste);
      } else {
        document.removeEventListener("paste", handlePaste);
      }
    };
  }, [isLoading]);

  // 파일 업로드 처리
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      imageService.uploadImage(type, file).then(newUrl => {
        setFile(null);
        setPreviewUrl(null);
        setValue(newUrl);
      });

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file, setValue, type]);

  return (
    <div ref={containerRef}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-black-accent"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="flex size-full flex-row items-center justify-between rounded-lg border border-skin-line bg-white p-6">
        <div className="relative">
          <div className="bg-skin-card-muted relative aspect-[4/3] w-[100px] overflow-hidden rounded-lg">
            {!isPending && (
              <img
                src={displayUrl}
                alt={`${label} 이미지`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 hover:scale-110"
              />
            )}
            {isPending && (
              <div className="flex h-full w-full items-center justify-center">
                <RiImageAddFill className="h-8 w-8 text-black-muted" />
              </div>
            )}
          </div>
          {!isPending && (
            <div className="absolute -bottom-1 left-0 w-full px-1">
              <div className="bg-skin-card-accent/90 w-full truncate rounded-b-lg py-1 text-center text-xs text-black-base backdrop-blur-sm">
                미리보기
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end px-4">
          {isLoading ? (
            <div className="bg-skin-card-muted flex items-center gap-2 rounded-lg px-6 py-3">
              <RiLoader2Fill className="h-5 w-5 animate-spin text-skin-accent" />
              <span className="text-sm text-black-base">업로드 중...</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-skin-card-muted hover:bg-skin-card-accent flex cursor-pointer items-center gap-2 rounded-lg px-6 py-3 text-sm text-black-base transition-all hover:opacity-90 active:scale-95"
                onClick={getClipboardContents}
              >
                <RiClipboardLine className="h-5 w-5" />
                <span>붙여넣기</span>
              </button>

              <label
                htmlFor={id}
                className={`group flex cursor-pointer items-center gap-2 rounded-lg px-6 py-3 text-sm transition-all hover:opacity-90 active:scale-95 ${
                  isPending
                    ? "bg-skin-accent text-white-base"
                    : "bg-skin-card-muted hover:bg-skin-card-accent text-black-base"
                }`}
              >
                {isPending ? (
                  <>
                    <RiImageAddFill className="h-5 w-5" />
                    <span>이미지 업로드</span>
                  </>
                ) : (
                  <>
                    <RiCheckFill className="h-5 w-5 text-skin-accent" />
                    <span>이미지 변경</span>
                  </>
                )}
                <input
                  ref={inputRef}
                  disabled={file !== null}
                  id={id}
                  name={name}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  required={required && isPending}
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null;
                    setFile(file);
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-black-base/70">
        <p>
          이미지는 파일 선택 또는 Ctrl+V(⌘+V)로 클립보드에서 붙여넣기가
          가능합니다.
        </p>
      </div>
    </div>
  );
};

export default ImageFileInput;
