import React, { useState, useImperativeHandle, forwardRef } from "react";

export interface SelectInputMethods {
  getValue: () => string;
  setValue: (value: string) => void;
}

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

const SelectInput = forwardRef<SelectInputMethods, SelectInputProps>(
  (
    {
      id,
      name,
      label,
      options,
      required = false,
      defaultValue = "",
      value: propValue,
      onChange,
      disabled = false,
    },
    ref,
  ) => {
    // 외부에서 value prop을 제공할 경우 그것을 사용하고, 그렇지 않으면 내부 상태 사용
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = propValue !== undefined ? propValue : internalValue;

    // options가 객체 배열인지 문자열 배열인지 확인
    const isObjectOptions =
      options.length > 0 && typeof options[0] === "object";

    // 외부에서 접근 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      getValue: () => value,
      setValue: (newValue: string) => {
        setInternalValue(newValue);
      },
    }));

    // select 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      if (onChange) {
        onChange(newValue);
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
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
