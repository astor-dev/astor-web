// src/components/Button.jsx
import React from "react";

export default function Button({
  variant = "primary", // primary | secondary | outline
  children,
  onClick,
  className = "",
  ...props
}) {
  let baseStyle =
    "inline-block px-4 py-2 font-medium focus:outline-none focus-outline transition rounded-md ";

  let variantStyle = "";

  switch (variant) {
    case "primary":
      variantStyle =
        "bg-skin-accent text-skin-inverted hover:bg-skin-accent/80";
      break;
    case "secondary":
      variantStyle =
        "bg-skin-card text-skin-accent border border-skin-accent hover:bg-skin-card-muted";
      break;
    case "outline":
      variantStyle =
        "bg-transparent border border-skin-accent text-skin-accent hover:bg-skin-accent/10";
      break;
    default:
      variantStyle = "bg-skin-accent text-skin-inverted";
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
