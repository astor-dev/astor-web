import React from "react";

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  defaultValue?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  name,
  label,
  options,
  required = false,
  defaultValue = "",
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-black-accent"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
      >
        <option value="">선택해주세요</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
