import React from "react";
import { FaHashtag } from "react-icons/fa";

interface TagProps {
  text: string;
  count?: number;
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  text,
  count,
  size = "sm",
  onClick,
  className,
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-skin-accent/10 to-skin-accent/5 font-medium text-skin-accent transition-all duration-300 hover:from-skin-accent/20 hover:to-skin-accent/10";

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      type={onClick ? "button" : "submit"}
    >
      <FaHashtag
        className={size === "sm" ? "h-2 w-2 opacity-70" : "h-3 w-3 opacity-70"}
      />
      <span>{text}</span>
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-skin-accent/10 px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
    </button>
  );
};

export default Tag;
