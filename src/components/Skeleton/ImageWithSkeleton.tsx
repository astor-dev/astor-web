import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ImageWithSkeletonProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoadComplete?: () => void;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className,
  style,
  onLoadComplete,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    // 캐시에 존재할 경우 바로 처리
    if (img.complete === true) {
      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    } else {
      // 이미지 로드 이벤트 등록
      img.onload = () => {
        setIsLoading(false);
        if (onLoadComplete) {
          onLoadComplete();
        }
      };
      img.onerror = () => {
        setIsLoading(false);
        if (onLoadComplete) {
          onLoadComplete();
        }
      };
    }
  }, [src, onLoadComplete]);

  return (
    <div className={`${className}`} style={style}>
      {isLoading && (
        <Skeleton
          className="absolute inset-0 h-full w-full"
          containerClassName="h-full w-full"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => {
          setIsLoading(false);
          if (onLoadComplete) {
            console.log("onLoadComplete (onLoad 트리거)");
            onLoadComplete();
          }
        }}
        onError={() => {
          setIsLoading(false);
          if (onLoadComplete) {
            console.log("onLoadComplete (onError 트리거)");
            onLoadComplete();
          }
        }}
        {...props}
      />
    </div>
  );
}
