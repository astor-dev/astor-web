import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import type { IconType } from "react-icons";
import { FiSearch } from "react-icons/fi";

export interface CheckboxGroupInputMethods {
  getValues: () => string[];
  setValues: (values: string[]) => void;
}

interface CheckboxOption {
  value: string;
  label: string;
  icon?: {
    Icon: IconType;
    color?: string;
  };
  description?: string;
  category?: string[];
}

interface CheckboxGroupInputProps {
  id?: string;
  name: string;
  label: string;
  options: CheckboxOption[];
  required?: boolean;
  defaultValues?: string[];
  enableSearch?: boolean;
  itemsPerPage?: number;
  onChange?: (values: string[]) => void;
}

const CheckboxGroupInput = forwardRef<
  CheckboxGroupInputMethods,
  CheckboxGroupInputProps
>(
  (
    {
      id,
      name,
      label,
      options,
      required = false,
      defaultValues = [],
      enableSearch = false,
      itemsPerPage = 9,
      onChange,
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] =
      useState<string[]>(defaultValues);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("전체");
    const [currentPage, setCurrentPage] = useState(1);

    // 외부에서 setValues로 설정되었는지 추적하는 ref
    const isExternallySetRef = useRef(false);
    // 초기화 완료 여부 추적
    const isInitializedRef = useRef(false);

    // selectedValues를 부모로부터 받은 defaultValues로 동기화 (초기화 시에만)
    useEffect(() => {
      if (Array.isArray(defaultValues) && !isInitializedRef.current) {
        setSelectedValues([...defaultValues]);
        isInitializedRef.current = true;
      }
    }, [defaultValues]);

    // 외부에서 접근 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      getValues: () => {
        return selectedValues;
      },
      setValues: (values: string[]) => {
        if (!values || !Array.isArray(values)) {
          return;
        }

        console.log("CheckboxGroupInput setValues 호출:", values);
        isExternallySetRef.current = true;
        setSelectedValues(values.filter(Boolean));
        if (onChange) {
          onChange(values.filter(Boolean));
        }
      },
    }));

    // 카테고리 목록 생성 (category가 있는 옵션이 하나라도 있을 때만)
    const hasCategories = options.some(opt => opt.category);
    const categories = hasCategories
      ? ["전체", ...new Set(options.map(opt => opt.category || "기타"))]
      : [];

    // 체크박스 변경 핸들러
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      const newValues = checked
        ? [...selectedValues, value]
        : selectedValues.filter(v => v !== value);

      setSelectedValues(newValues);
      onChange?.(newValues);
    };

    // 검색어와 카테고리로 필터링된 옵션들
    const filteredOptions = options.filter(option => {
      const matchesSearch = !enableSearch
        ? true
        : option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !hasCategories
        ? true
        : selectedCategory === "전체" ||
          option.category?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOptions = filteredOptions.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
    const uniqueCategories = Array.from(
      new Set(
        filteredOptions
          .map(option => option.category)
          .flat()
          .filter(category => category !== undefined),
      ),
    );

    // 페이지 변경 핸들러
    const handlePageChange = (e: React.MouseEvent, page: number) => {
      e.preventDefault();
      setCurrentPage(page);
    };

    return (
      <div id={id ? id : undefined}>
        <label className="mb-2 block text-sm font-medium text-black-accent">
          {label} {required && <span className="text-danger">*</span>}
        </label>

        {/* 검색 및 카테고리 필터 */}
        {(enableSearch || hasCategories) && (
          <div className="mb-4 flex flex-wrap gap-4">
            {enableSearch && (
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black-muted" />
                <input
                  type="text"
                  className="focus:ring-skin-accent w-full rounded-lg border border-skin-line py-2 pl-10 pr-4 text-sm text-black-base focus:border-skin-accent focus:outline-none focus:ring-1"
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            {hasCategories && (
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    className={`rounded-full px-4 py-1 text-sm ${
                      selectedCategory === category
                        ? "bg-skin-accent text-white-base"
                        : "bg-skin-card-muted text-black-base hover:bg-skin-accent hover:text-white-base"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1); // 카테고리 변경 시 첫 페이지로
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 체크박스 그리드 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedOptions.map(option => (
            <label
              key={option.value}
              className="hover:bg-skin-card-muted flex cursor-pointer items-start gap-3 rounded-lg border border-skin-line p-3"
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={handleCheckboxChange}
                className="focus:ring-skin-accent mt-1 rounded border-skin-line text-skin-accent"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <option.icon.Icon
                      className="h-5 w-5 text-skin-accent"
                      style={{ color: option.icon.color }}
                    />
                  )}
                  <span className="font-medium text-black-base">
                    {option.label}
                  </span>
                </div>
                {option.description && (
                  <p className="mt-1 text-sm text-black-muted">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={e => handlePageChange(e, page)}
                className={`h-8 w-8 rounded-full text-sm ${
                  currentPage === page
                    ? "bg-skin-accent text-white-base"
                    : "bg-skin-card-muted hover:bg-skin-card-accent text-black-base"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* 검색 결과가 없을 때 메시지 */}
        {filteredOptions.length === 0 && (
          <p className="mt-4 text-center text-sm text-black-muted">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    );
  },
);

CheckboxGroupInput.displayName = "CheckboxGroupInput";

export default CheckboxGroupInput;
