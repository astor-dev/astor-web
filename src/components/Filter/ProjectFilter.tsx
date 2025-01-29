"use client";

import React, { type Dispatch, type SetStateAction } from "react";
import { projectTypeEnum } from "~types/project.type";

interface ProjectFilterProps {
  selectedType: string | undefined;
  setSelectedType: Dispatch<SetStateAction<string | undefined>>;
}

const filterOptions = [
  { value: "all", label: "전체" },
  { value: projectTypeEnum.Enum["Company-project"], label: "회사 프로젝트" },
  { value: projectTypeEnum.Enum["Side-project"], label: "사이드 프로젝트" },
  { value: projectTypeEnum.Enum["Toy-project"], label: "토이 프로젝트" },
];

export default function ProjectFilter({
  selectedType,
  setSelectedType,
}: ProjectFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex w-fit items-center gap-2 rounded-lg p-4 transition-all hover:bg-skin-fill/5 active:scale-90 ${
          selectedType === undefined ? "" : "text-skin-accent"
        }`}
      >
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        {selectedType && selectedType !== "all"
          ? `필터 (${filterOptions.find(opt => opt.value === selectedType)?.label})`
          : "필터"}
        <svg
          className={`h-5 w-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 flex w-fit flex-wrap gap-2 rounded-xl bg-skin-fill/5 p-4">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() =>
                setSelectedType(curr =>
                  curr === option.value ? undefined : option.value,
                )
              }
              className={`hover:text-white rounded-full border border-skin-line px-6 py-2 text-sm transition-colors hover:bg-skin-accent ${
                selectedType === option.value ? "text-white bg-skin-accent" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function useProjectTypeFilter() {
  const [selectedType, setSelectedType] = React.useState<string | undefined>(
    "all",
  );
  return { selectedType, setSelectedType };
}
