import React from "react";
import { FaCode, FaPen, FaPlus } from "react-icons/fa";

const IconRecord: Record<string, React.ElementType> = {
  FaCode: FaCode,
  FaPen: FaPen,
  FaPlus: FaPlus,
};

interface IconButtonProps {
  icon?: keyof typeof IconRecord;
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  href,
  onClick,
  variant = "primary",
  size = "md",
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

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        <ButtonContent />
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      <ButtonContent />
    </button>
  );
};

export default IconButton;
