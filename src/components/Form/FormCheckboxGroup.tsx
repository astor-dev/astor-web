import React from "react";

interface FormCheckboxGroupProps {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  defaultValues?: string[];
}

const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  name,
  label,
  options,
  required = false,
  defaultValues = [],
}) => {
  return (
    <div className="lg:col-span-2">
      <label className="mb-2 block text-sm font-medium text-black-accent">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="flex flex-wrap gap-3">
        {options.map(option => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={defaultValues.includes(option)}
              className="focus:ring-skin-accent rounded border-skin-line text-skin-accent"
            />
            <span className="text-sm text-black-base">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FormCheckboxGroup;
