import React, { useState, useCallback, useRef } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, FocusEvent } from "react";

interface AutoCompleteMultiInputProps {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  allTags: string[]; // 자동완성으로 추천할 전체 태그 목록
  defaultValue?: string[]; // 초기 선택된 태그
  disabled?: boolean;
  onTagsChange: (tags: string[]) => void;
}

/**
 * 디자인 시스템:
 * - label: Input과 동일하게 "mb-2 block text-sm font-medium text-black-accent"
 * - input 컨테이너: Input.tsx의 클래스와 유사하게 "w-full rounded-lg border border-skin-line px-4 py-2 ..."
 * - 태그: Input 요소와 높이 및 배경색을 맞추고 한 줄에서 넘치지 않도록 설정 (overflow-hidden, whitespace-nowrap)
 */
const AutoCompleteMultiInput: React.FC<AutoCompleteMultiInputProps> = ({
  id,
  name,
  label,
  required = false,
  placeholder,
  allTags,
  defaultValue = [],
  disabled = false,
  onTagsChange,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // 태그 입력 변경
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // 빈 문자열이면 목록 숨김
      if (value.trim() === "") {
        setFilteredOptions([]);
        setShowSuggestions(false);
        return;
      }

      // 입력값을 포함하고 아직 선택되지 않은 태그들 필터링
      const filtered = allTags.filter(
        tag =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag),
      );
      setFilteredOptions(filtered);
      setShowSuggestions(true);
    },
    [allTags, selectedTags],
  );

  // 키보드 조작 (Enter나 ',' 로 입력 시 태그 등록)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(inputValue);
      }
    },
    [inputValue],
  );

  // 태그 추가 로직
  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim().replace(",", "");
      if (trimmed !== "" && !selectedTags.includes(trimmed)) {
        const newTags = [...selectedTags, trimmed];
        setSelectedTags(newTags);
        onTagsChange(newTags); // 상위 폼 등에 전달
      }
      setInputValue("");
      setShowSuggestions(false);
      setFilteredOptions([]);
    },
    [selectedTags, onTagsChange],
  );

  // 자동완성 항목 클릭
  const handleOptionClick = useCallback(
    (option: string) => {
      addTag(option);
    },
    [addTag],
  );

  // 태그 삭제
  const removeTag = useCallback(
    (tagToRemove: string) => {
      const newTags = selectedTags.filter(tag => tag !== tagToRemove);
      setSelectedTags(newTags);
      onTagsChange(newTags);
    },
    [selectedTags, onTagsChange],
  );

  // 포커스를 잃었을 때 (blur) 처리
  const handleBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
    // 클릭 이벤트가 우선 처리되도록 약간의 지연
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
      {/* 라벨 */}
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-black-accent"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {/* 입력 컨테이너 - Input.tsx와 동일한 스타일 */}
      <div
        className={`focus-within:ring-skin-accent relative w-full rounded-lg border border-skin-line bg-white px-4 py-2 text-black-base transition-colors duration-150 focus-within:border-skin-accent focus-within:outline-none focus-within:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${disabled ? "cursor-not-allowed" : ""}`}
      >
        {/* 태그와 입력 필드를 한 줄에 표시 (줄바꿈 없이) */}
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          {selectedTags.map(tag => (
            <div
              key={tag}
              className="flex items-center space-x-1 whitespace-nowrap rounded-lg border border-skin-line bg-skin-fill px-2 text-skin-accent"
            >
              <span className="overflow-hidden text-ellipsis">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    removeTag(tag);
                  }}
                  className="text-black-base hover:text-black-accent"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {/* 실제 입력 필드 - Input.tsx 스타일과 동일하게 */}
          <input
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            disabled={disabled}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="placeholder:text-skin-muted flex-1 border-none bg-transparent outline-none"
          />
        </div>

        {/* 자동완성 목록 */}
        {showSuggestions && filteredOptions.length > 0 && (
          <ul className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-skin-line bg-white shadow-lg">
            {filteredOptions.map(option => (
              <li
                key={option}
                onMouseDown={() => handleOptionClick(option)}
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

export default AutoCompleteMultiInput;
