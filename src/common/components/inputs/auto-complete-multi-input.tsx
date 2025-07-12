import {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

export interface AutoCompleteMultiInputMethods {
  getValues: () => string[];
  setValues: (values: string[]) => void;
  getTags: () => TagOption[];
  setTags: (tags: TagOption[]) => void;
}

// 태그 옵션 타입 정의
interface TagOption {
  label: string; // 화면에 표시될 텍스트
  value: string; // 실제 저장될 값
}

interface AutoCompleteMultiInputProps {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: TagOption[]; // 자동완성으로 추천할 전체 태그 옵션 목록
  allTags?: string[]; // 기존 호환성 위한 옵션 (deprecated)
  defaultValue?: string[]; // 초기 선택된 태그 값 배열
  defaultLabels?: string[]; // 초기 선택된 태그 라벨 배열 (선택적)
  disabled?: boolean;
  onTagsChange?: (tags: string[]) => void;
}

/**
 * 디자인 시스템:
 * - label: Input과 동일하게 "mb-2 block text-sm font-medium text-black-accent"
 * - input 컨테이너: Input.tsx의 클래스와 유사하게 "w-full rounded-lg border border-skin-line px-4 py-2 ..."
 * - 태그: Input 요소와 높이 및 배경색을 맞추고 한 줄에서 넘치지 않도록 설정 (overflow-hidden, whitespace-nowrap)
 */
const AutoCompleteMultiInput = forwardRef<
  AutoCompleteMultiInputMethods,
  AutoCompleteMultiInputProps
>(
  (
    {
      id,
      name,
      label,
      required = false,
      placeholder,
      options = [],
      allTags = [], // 이전 버전 호환성 유지
      defaultValue = [],
      defaultLabels = [],
      disabled = false,
      onTagsChange,
    },
    ref,
  ) => {
    // allTags가 제공되면 이를 options 형태로 변환 (이전 버전 호환)
    const tagOptions: TagOption[] =
      options.length > 0
        ? options
        : allTags.map(tag => ({ label: tag, value: tag }));

    // 초기 선택된 태그 값과 표시 라벨 매핑
    const initialTagData = defaultValue.map((value, index) => {
      const label =
        defaultLabels[index] ||
        tagOptions.find(opt => opt.value === value)?.label ||
        value;
      return { value, label };
    });

    // 선택된 태그들을 { value, label } 쌍으로 관리
    const [selectedTags, setSelectedTags] =
      useState<TagOption[]>(initialTagData);
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<TagOption[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // 마지막 태그 추가 시간 저장 (쓰로틀링용)
    const lastAddedRef = useRef<number>(0);
    const throttleTimeMs = 300; // 쓰로틀링 시간 (ms)

    const containerRef = useRef<HTMLDivElement>(null);

    // 외부에서 접근 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      getValues: () => selectedTags.map(tag => tag.value),
      setValues: (values: string[]) => {
        console.log(
          `AutoCompleteMultiInput[${id || "unknown"}] setValues:`,
          values,
        );

        if (!values || !Array.isArray(values)) {
          console.warn("유효하지 않은 태그 값:", values);
          return;
        }

        const newTags = values.map(value => {
          const option = tagOptions.find(opt => opt.value === value);
          return option || { value, label: value };
        });

        setSelectedTags(newTags);
        if (onTagsChange) {
          onTagsChange(values);
        }
      },
      getTags: () => selectedTags,
      setTags: (tags: TagOption[]) => {
        console.log(
          `AutoCompleteMultiInput[${id || "unknown"}] setTags:`,
          tags,
        );
        setSelectedTags(tags);
        if (onTagsChange) {
          onTagsChange(tags.map(tag => tag.value));
        }
      },
    }));

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
        const selectedValues = selectedTags.map(tag => tag.value);
        const filtered = tagOptions.filter(
          tag =>
            tag.label.toLowerCase().includes(value.toLowerCase()) &&
            !selectedValues.includes(tag.value),
        );
        setFilteredOptions(filtered);
        setShowSuggestions(true);
      },
      [tagOptions, selectedTags],
    );

    // 쓰로틀링 적용된 태그 추가 함수
    const addTag = useCallback(
      (input: string) => {
        const now = Date.now();
        // 마지막 추가 후 throttleTimeMs 시간이 지나지 않았으면 무시
        if (now - lastAddedRef.current < throttleTimeMs) {
          return;
        }

        lastAddedRef.current = now;
        const trimmed = input.trim().replace(",", "");

        if (trimmed === "") return; // 공백만 있는 경우 무시

        // 이미 선택된 태그 값인지 확인
        const selectedValues = selectedTags.map(tag => tag.value);
        if (selectedValues.includes(trimmed)) return;

        // 기존 태그 목록에서 일치하는 옵션 찾기
        const existingOption = tagOptions.find(
          opt => opt.label.toLowerCase() === trimmed.toLowerCase(),
        );

        // 새 태그 옵션 생성 (기존에 없으면 입력값을 label과 value로 사용)
        const newTag = existingOption || {
          label: trimmed,
          value: trimmed,
        };

        const newTags = [...selectedTags, newTag];
        setSelectedTags(newTags);

        // 상위 컴포넌트에는 value만 전달
        if (onTagsChange) {
          onTagsChange(newTags.map(tag => tag.value));
        }

        setInputValue("");
        setShowSuggestions(false);
        setFilteredOptions([]);
      },
      [selectedTags, tagOptions, onTagsChange],
    );

    // 키보드 조작 (Enter나 ',' 로 입력 시 태그 등록)
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();

          // 추천 목록에서 선택할 경우
          if (showSuggestions && filteredOptions.length > 0) {
            handleOptionClick(filteredOptions[0]);
          } else {
            // 직접 입력 값으로 태그 추가
            addTag(inputValue);
          }
        }
      },
      [inputValue, showSuggestions, filteredOptions, addTag],
    );

    // 자동완성 항목 클릭
    const handleOptionClick = useCallback(
      (option: TagOption) => {
        const now = Date.now();
        if (now - lastAddedRef.current < throttleTimeMs) {
          return;
        }

        lastAddedRef.current = now;

        // 이미 선택된 태그인지 확인
        const selectedValues = selectedTags.map(tag => tag.value);
        if (selectedValues.includes(option.value)) return;

        const newTags = [...selectedTags, option];
        setSelectedTags(newTags);
        if (onTagsChange) {
          onTagsChange(newTags.map(tag => tag.value));
        }

        setInputValue("");
        setShowSuggestions(false);
        setFilteredOptions([]);
      },
      [selectedTags, onTagsChange],
    );

    // 태그 삭제
    const removeTag = useCallback(
      (tagValueToRemove: string) => {
        const newTags = selectedTags.filter(
          tag => tag.value !== tagValueToRemove,
        );
        setSelectedTags(newTags);
        if (onTagsChange) {
          onTagsChange(newTags.map(tag => tag.value));
        }
      },
      [selectedTags, onTagsChange],
    );

    // 포커스를 잃었을 때 (blur) 처리
    const handleBlur = useCallback(() => {
      // 클릭 이벤트가 우선 처리되도록 약간의 지연
      setTimeout(() => {
        if (
          containerRef.current &&
          !containerRef.current.contains(document.activeElement)
        ) {
          setShowSuggestions(false);

          // 입력중인 값이 있으면 태그로 추가
          if (inputValue.trim()) {
            addTag(inputValue);
          }
        }
      }, 200);
    }, [inputValue, addTag]);

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

        {/* 입력 컨테이너 */}
        <div
          className={`focus-within:ring-skin-accent relative w-full rounded-lg border border-skin-line bg-white px-4 py-2 text-black-base transition-colors duration-150 focus-within:border-skin-accent focus-within:outline-none focus-within:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${disabled ? "cursor-not-allowed" : ""}`}
        >
          {/* 태그와 입력 필드를 한 줄에 표시 (줄바꿈 없이) */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedTags.map(tag => (
              <div
                key={tag.value}
                className="flex items-center space-x-1 whitespace-nowrap rounded-lg border border-skin-line bg-skin-fill px-2 text-skin-accent"
              >
                <span className="overflow-hidden text-ellipsis">
                  {tag.label}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      removeTag(tag.value);
                    }}
                    className="text-black-base hover:text-black-accent"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {/* 실제 입력 필드 */}
            <input
              id={id}
              name={name}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              disabled={disabled}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="placeholder:text-skin-muted min-w-[100px] flex-1 border-none bg-transparent outline-none"
            />
          </div>

          {/* 자동완성 목록 */}
          {showSuggestions && filteredOptions.length > 0 && (
            <ul className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-skin-line bg-white shadow-lg">
              {filteredOptions.map(option => (
                <li
                  key={option.value}
                  onMouseDown={() => handleOptionClick(option)}
                  className="cursor-pointer p-2 text-sm hover:bg-gray-100"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}

          {/* 실제 선택된 값들을 hidden input으로 전달 */}
          {name &&
            selectedTags.map((tag, index) => (
              <input
                key={`${tag.value}-${index}`}
                type="hidden"
                name={`${name}[]`}
                value={tag.value}
              />
            ))}
        </div>
      </div>
    );
  },
);

AutoCompleteMultiInput.displayName = "AutoCompleteMultiInput";

export default AutoCompleteMultiInput;
