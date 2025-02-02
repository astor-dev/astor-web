import React from "react";

interface InputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "url" | "date" | "month";
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  type = "text",
  required = false,
  defaultValue = "",
  placeholder,
  min,
  max,
  onChange,
  disabled,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-black-accent"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={onChange}
        disabled={disabled}
        className={`focus:ring-skin-accent disabled:all-unset w-full rounded-lg border border-skin-line px-4 py-2 text-black-base focus:border-skin-accent focus:outline-none focus:ring-1 disabled:w-full disabled:rounded-lg disabled:border disabled:border-skin-line disabled:bg-skin-fill disabled:px-4 disabled:py-2 disabled:opacity-60 ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
};

export default Input;
