import React, { useEffect, useRef, useState } from "react";
import { ImageService } from "~services/image.service";
import type { ImageExtension, ImageKey } from "~types/image.type";
import { RiImageAddFill, RiCheckFill, RiLoader2Fill } from "react-icons/ri";

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

  const isLoading = file !== null;
  const isPending = !value && !previewUrl;
  const displayUrl = previewUrl || value;

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      ImageService.uploadImage(type, file).then(newUrl => {
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
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-black-accent"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="flex size-full flex-row items-center justify-between rounded-lg border border-skin-line bg-white p-6">
        <div className="relative">
          <div className="bg-skin-card-muted relative aspect-[3/4] w-[100px] overflow-hidden rounded-lg">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageFileInput;
