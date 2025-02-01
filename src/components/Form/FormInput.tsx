import React from "react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "url" | "date";
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  type = "text",
  required = false,
  defaultValue = "",
  placeholder,
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
        className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
      />
    </div>
  );
};

export default FormInput;
