// src/components/ImageWithSkeleton.tsx
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ImageWithSkeletonProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoadComplete?: () => void; // 새로운 콜백 prop 추가
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className,
  style,
  onLoadComplete,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoadComplete) {
      onLoadComplete();
    }
  };

  const handleError = () => {
    setIsLoading(false);
    if (onLoadComplete) {
      onLoadComplete();
    }
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <Skeleton
          className="absolute inset-0 h-full w-full"
          containerClassName="h-full w-full"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default ImageWithSkeleton;
