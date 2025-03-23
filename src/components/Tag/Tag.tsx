import React from "react";
import { FaHashtag } from "react-icons/fa";

interface TagProps {
  tag: string;
  count?: number;
  size?: "sm" | "md";
  href?: string;
  className?: string;
}

/**
 * href가 전달된 경우에는 클릭 가능한 a 태그로 렌더링하고,
 * 그렇지 않으면 정적인 span으로 렌더링하여 사용자에게 눌리지 않는 느낌을 줍니다.
 */
const Tag: React.FC<TagProps> = ({
  tag,
  count,
  size = "sm",
  href = "#", // 기본값으로 "#"을 지정
  className = "",
}) => {
  const isClickable = href !== "#";

  const baseStyles =
    "inline-flex flex-shrink-0 overflow-visible items-center gap-1.5 rounded-full bg-gradient-to-r from-skin-accent/10 to-skin-accent/5 font-medium text-skin-accent transition-all duration-300 no-underline min-w-fit whitespace-nowrap";
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-4 py-2 text-sm",
  };

  // 클릭 가능한 경우와 정적인 경우 스타일 분리
  const clickableClasses =
    "cursor-pointer hover:from-skin-accent/20 hover:to-skin-accent/10";
  const staticClasses = "cursor-default";
  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${
    isClickable ? clickableClasses : staticClasses
  } ${className}`;

  const content = (
    <div className="flex items-center gap-1.5">
      <FaHashtag
        className={size === "sm" ? "h-2 w-2 opacity-70" : "h-3 w-3 opacity-70"}
      />
      <span>{tag}</span>
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-skin-accent/10 px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
    </div>
  );

  if (isClickable) {
    return (
      <a className={combinedClasses} href={href} role="button" tabIndex={0}>
        {content}
      </a>
    );
  } else {
    return <span className={combinedClasses}>{content}</span>;
  }
};

export default Tag;
