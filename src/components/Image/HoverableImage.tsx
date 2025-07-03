import React from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";

interface HoverableImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function HoverableImage({
  src,
  alt,
  className,
  style,
}: HoverableImageProps) {
  return (
    <div className="group relative h-full w-full overflow-hidden">
      <ImageWithSkeleton
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-all duration-300 md:group-hover:scale-110 ${className}`}
        style={style}
      />
      {/* <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/70" /> */}
      {/* <div className="absolute inset-0 z-10 flex items-center justify-center"> */}
      {/* <div className="flex items-center gap-2 text-white-base opacity-0 transition-all duration-300 group-hover:opacity-100"> */}
      {/* <span className="text-sm font-medium md:text-lg">보러가기</span> */}
      {/* <FaArrowRight className="h-3 w-3" /> */}
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}
