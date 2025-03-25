import React, { useState, useImperativeHandle, forwardRef } from "react";

export interface InputMethods {
  getValue: () => string;
  setValue: (value: string) => void;
}

interface InputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "url" | "date" | "month" | "datetime-local";
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  pattern?: string;
  title?: string;
}

const Input = forwardRef<InputMethods, InputProps>(
  (
    {
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
      pattern,
      title,
    },
    ref,
  ) => {
    const [value, setValue] = useState(defaultValue);

    // 외부에서 접근 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      getValue: () => value,
      setValue: (newValue: string) => {
        setValue(newValue);
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (onChange) {
        onChange(e);
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
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={handleChange}
          disabled={disabled}
          pattern={pattern}
          title={title}
          className={`focus:ring-skin-accent disabled:all-unset w-full rounded-lg border border-skin-line px-4 py-2 text-black-base focus:border-skin-accent focus:outline-none focus:ring-1 disabled:w-full disabled:rounded-lg disabled:border disabled:border-skin-line disabled:bg-skin-fill disabled:px-4 disabled:py-2 disabled:opacity-60 ${
            disabled ? "cursor-not-allowed" : ""
          }`}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
