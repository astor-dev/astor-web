import React from "react";

interface TextareaInputProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  id,
  name,
  label,
  required = false,
  defaultValue = "",
  rows = 3,
  placeholder,
}) => {
  return (
    <div className="lg:col-span-2">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-black-accent"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 text-black-base focus:border-skin-accent focus:outline-none focus:ring-1"
      />
    </div>
  );
};

export default TextareaInput;
