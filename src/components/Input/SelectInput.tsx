import React from "react";

interface SelectInputProps {
  id: string;
  name?: string;
  label: string;
  options: string[] | { label: string; value: string }[];
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  name,
  label,
  options,
  required = false,
  defaultValue = "",
  value,
  onChange,
  disabled = false,
}) => {
  // options가 객체 배열인지 문자열 배열인지 확인
  const isObjectOptions = options.length > 0 && typeof options[0] === "object";

  // select 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

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
        name={name || id}
        required={required}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 text-black-base focus:border-skin-accent focus:outline-none focus:ring-1 disabled:bg-gray-100 disabled:opacity-70"
      >
        {isObjectOptions
          ? // 객체 배열인 경우
            (options as { label: string; value: string }[]).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : // 문자열 배열인 경우
            (options as string[]).map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
      </select>
    </div>
  );
};

export default SelectInput;
