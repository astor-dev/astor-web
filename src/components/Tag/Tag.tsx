import React from "react";
import { FaHashtag } from "react-icons/fa";

interface TagProps {
  tag: string;
  count?: number;
  size?: "xs" | "sm" | "md" | "responsive";
  theme?: "primary" | "secondary";
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
  size = "responsive",
  theme = "primary",
  href = "#", // 기본값으로 "#"을 지정
  className = "",
}) => {
  const isClickable = href !== "#";

  const baseStyles =
    "inline-flex flex-shrink-0 overflow-visible items-center gap-1.5 rounded-full font-medium transition-all duration-300 no-underline min-w-fit whitespace-nowrap";

  const themeStyles = {
    primary:
      "bg-gradient-to-r from-skin-accent/10 to-skin-accent/5 text-skin-accent hover:from-skin-accent/20 hover:to-skin-accent/10",
    secondary:
      "bg-skin-fill text-skin-accent hover:bg-skin-fill/60 hover:text-skin-accent/80",
  };

  const sizeStyles = {
    xs: "px-1 py-0.5 text-[8px]",
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-4 py-2 text-sm",
    responsive: "px-1.5 py-0.5 text-[10px] md:px-2.5 md:py-0.5 md:text-xs",
  };

  // 클릭 가능한 경우와 정적인 경우 스타일 분리
  const clickableClasses = "cursor-pointer";
  const staticClasses = "cursor-default";
  const combinedClasses = `${baseStyles} ${themeStyles[theme]} ${sizeStyles[size]} ${
    isClickable ? clickableClasses : staticClasses
  } ${className}`;

  const content = (
    <div className="flex items-center gap-1.5">
      <FaHashtag
        className={
          size === "responsive"
            ? "h-1.5 w-1.5 opacity-70 md:h-2 md:w-2"
            : size === "xs"
              ? "h-1.5 w-1.5 opacity-70"
              : size === "sm"
                ? "h-2 w-2 opacity-70"
                : "h-3 w-3 opacity-70"
        }
      />
      <span>{tag}</span>
      {count !== undefined && (
        <span
          className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
            theme === "primary" ? "bg-skin-accent/10" : "bg-skin-fill/10"
          }`}
        >
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
