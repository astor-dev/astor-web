import React, { useState, useCallback, useRef } from "react";
import type { ChangeEvent, KeyboardEvent, FocusEvent } from "react";

interface AutoCompleteInputProps {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  allOptions: string[]; // 자동완성으로 보여줄 전체 옵션 목록
  defaultValue?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  id,
  name,
  label,
  required = false,
  placeholder,
  allOptions,
  defaultValue = "",
  disabled = false,
  onValueChange,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 입력 변경 시 필터링 및 상태 업데이트
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onValueChange(value);

      if (value.trim() === "") {
        setFilteredOptions([]);
        setShowSuggestions(false);
        return;
      }

      const filtered = allOptions.filter(opt =>
        opt.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredOptions(filtered);
      setShowSuggestions(true);
    },
    [allOptions, onValueChange],
  );

  // 옵션 선택 시 처리
  const selectOption = useCallback(
    (option: string) => {
      setInputValue(option);
      onValueChange(option);
      setFilteredOptions([]);
      setShowSuggestions(false);
    },
    [onValueChange],
  );

  // 엔터 혹은 탭 키 입력 시 첫번째 옵션 선택
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "Tab") {
        if (filteredOptions.length > 0) {
          e.preventDefault();
          selectOption(filteredOptions[0]);
        }
      }
    },
    [filteredOptions, selectOption],
  );

  // 포커스를 잃었을 때 자동완성 목록 숨김 처리
  const handleBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (
        containerRef.current &&
        !containerRef.current.contains(document.activeElement)
      ) {
        setShowSuggestions(false);
      }
    }, 200);
  }, []);

  return (
    <div ref={containerRef} onBlur={handleBlur} className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-black-accent"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div
        className={`focus-within:ring-skin-accent relative w-full rounded-lg border border-skin-line bg-white px-4 py-2 text-black-base transition-colors duration-150 focus-within:border-skin-accent focus-within:outline-none focus-within:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <input
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="placeholder:text-skin-muted w-full border-none bg-transparent outline-none"
        />
        {showSuggestions && filteredOptions.length > 0 && (
          <ul className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-skin-line bg-white shadow-lg">
            {filteredOptions.map(option => (
              <li
                key={option}
                onMouseDown={() => selectOption(option)}
                className="cursor-pointer p-2 text-sm hover:bg-gray-100"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutoCompleteInput;
