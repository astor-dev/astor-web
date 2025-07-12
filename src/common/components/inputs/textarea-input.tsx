import React, { useState, useImperativeHandle, forwardRef } from "react";

export interface TextareaInputMethods {
  getValue: () => string;
  setValue: (value: string) => void;
}

interface TextareaInputProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}

const TextareaInput = forwardRef<TextareaInputMethods, TextareaInputProps>(
  (
    {
      id,
      name,
      label,
      required = false,
      defaultValue = "",
      rows = 3,
      placeholder,
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

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
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={handleChange}
          className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 text-black-base focus:border-skin-accent focus:outline-none focus:ring-1"
        />
      </div>
    );
  },
);

TextareaInput.displayName = "TextareaInput";

export default TextareaInput;
