import React from "react";
import { FaCode, FaPen, FaPlus, FaShare } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const IconRecord: Record<string, React.ElementType> = {
  FaCode: FaCode,
  FaPen: FaPen,
  FaPlus: FaPlus,
  FaShare: FaShare,
  FiExternalLink: FiExternalLink,
};

interface IconButtonProps {
  icon?: keyof typeof IconRecord;
  text: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  target?: string;
  rel?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  href,
  type = "button",
  onClick,
  variant = "primary",
  size = "md",
  target,
  rel,
}) => {
  const Icon = icon ? IconRecord[icon] : null;
  const baseStyles =
    "inline-flex items-center gap-2 rounded-lg font-medium transition-colors";

  const variantStyles = {
    primary: "bg-skin-accent text-white-base hover:bg-skin-accent/90",
    secondary:
      "bg-skin-fill text-black-base hover:text-black-base hover:bg-skin-fill/90",
    danger:
      "bg-danger text-white-base hover:text-white-base hover:bg-danger/90",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`;

  const ButtonContent = () => (
    <>
      {Icon && <Icon className="text-sm" />}
      {text}
    </>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (type !== "submit") {
      e.preventDefault();
    }
    if (onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <a href={href} className={buttonClasses} target={target} rel={rel}>
        <ButtonContent />
      </a>
    );
  }

  return (
    <button type={type} onClick={handleClick} className={buttonClasses}>
      <ButtonContent />
    </button>
  );
};

export default IconButton;
