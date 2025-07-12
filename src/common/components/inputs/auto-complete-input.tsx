import {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

export interface AutoCompleteInputMethods {
  getValue: () => string;
  setValue: (value: string) => void;
  getLabel: () => string;
  setLabel: (label: string) => void;
}

// 옵션 타입 정의 추가
interface Option {
  label: string;
  value: string;
}

interface AutoCompleteInputProps {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: Option[]; // 자동완성 옵션 목록 (label, value 쌍)
  defaultValue?: string; // 기본 선택값 (value)
  defaultLabel?: string; // 기본 표시 텍스트 (label)
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

const AutoCompleteInput = forwardRef<
  AutoCompleteInputMethods,
  AutoCompleteInputProps
>(
  (
    {
      id,
      name,
      label,
      required = false,
      placeholder,
      options,
      defaultValue = "",
      defaultLabel = "",
      disabled = false,
      onValueChange,
    },
    ref,
  ) => {
    // 초기 표시될 라벨: defaultLabel이 있으면 사용, 없으면 defaultValue에 해당하는 label 찾기
    const initialLabel =
      defaultLabel ||
      (defaultValue
        ? options.find(opt => opt.value === defaultValue)?.label || ""
        : "");

    const [inputValue, setInputValue] = useState(initialLabel);
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 외부에서 접근 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      getValue: () => selectedValue,
      setValue: (value: string) => {
        console.log(`AutoCompleteInput[${id || "unknown"}] setValue:`, value);
        setSelectedValue(value);
        // 해당 값에 맞는 라벨도 업데이트
        const option = options.find(opt => opt.value === value);
        if (option) {
          setInputValue(option.label);
        }
      },
      getLabel: () => inputValue,
      setLabel: (label: string) => {
        console.log(`AutoCompleteInput[${id || "unknown"}] setLabel:`, label);
        setInputValue(label);
      },
    }));

    // 입력 변경 시 필터링 및 상태 업데이트
    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // 입력값이 비어있으면 선택 값도 비움
        if (value.trim() === "") {
          setSelectedValue("");
          if (onValueChange) {
            onValueChange("");
          }
          setFilteredOptions([]);
          setShowSuggestions(false);
          return;
        }

        // 입력 텍스트로 옵션 필터링
        const filtered = options.filter(opt =>
          opt.label.toLowerCase().includes(value.toLowerCase()),
        );
        setFilteredOptions(filtered);
        setShowSuggestions(true);
      },
      [options, onValueChange],
    );

    // 옵션 선택 시 처리
    const selectOption = useCallback(
      (option: Option) => {
        setInputValue(option.label);
        setSelectedValue(option.value);
        if (onValueChange) {
          onValueChange(option.value);
        }
        setFilteredOptions([]);
        setShowSuggestions(false);
      },
      [onValueChange],
    );

    // 엔터 혹은 탭 키 입력 시 첫번째 옵션 선택
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (
          (e.key === "Enter" || e.key === "Tab") &&
          filteredOptions.length > 0
        ) {
          e.preventDefault();
          selectOption(filteredOptions[0]);
        }
      },
      [filteredOptions, selectOption],
    );

    // 포커스를 잃었을 때 자동완성 목록 숨김 처리
    const handleBlur = useCallback(() => {
      setTimeout(() => {
        if (
          containerRef.current &&
          !containerRef.current.contains(document.activeElement)
        ) {
          setShowSuggestions(false);

          // 선택된 값이 없고 입력값이 있는 경우, 정확히 일치하는 옵션을 찾아 선택
          if (!selectedValue && inputValue) {
            const exactMatch = options.find(
              opt => opt.label.toLowerCase() === inputValue.toLowerCase(),
            );
            if (exactMatch) {
              setSelectedValue(exactMatch.value);
              if (onValueChange) {
                onValueChange(exactMatch.value);
              }
              setInputValue(exactMatch.label);
            } else {
              // 일치하는 값이 없으면 입력값 초기화
              setInputValue("");
            }
          }
        }
      }, 200);
    }, [inputValue, selectedValue, options, onValueChange]);

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

          {/* 실제 값을 담는 hidden input */}
          <input
            type="hidden"
            name={name ? `${name}_value` : `${id}_value`}
            value={selectedValue}
          />

          {showSuggestions && filteredOptions.length > 0 && (
            <ul className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-skin-line bg-white shadow-lg">
              {filteredOptions.map(option => (
                <li
                  key={option.value}
                  onMouseDown={() => selectOption(option)}
                  className="cursor-pointer p-2 text-sm hover:bg-gray-100"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
);

AutoCompleteInput.displayName = "AutoCompleteInput";

export default AutoCompleteInput;
