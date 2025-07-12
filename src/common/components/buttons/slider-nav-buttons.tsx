import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface SliderNavButtonsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  className?: string;
}

/**
 * 슬라이더용 네비게이션 버튼 컴포넌트
 * 부모 요소에 group 클래스가 있어야 호버 효과가 작동합니다.
 */
const SliderNavButtons: React.FC<SliderNavButtonsProps> = ({
  onPrevClick,
  onNextClick,
  className = "",
}) => {
  return (
    <>
      <button
        onClick={onPrevClick}
        className={`z-base absolute -left-10 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-skin-fill p-6 text-3xl text-black-accent opacity-0 transition-opacity duration-300 group-hover:opacity-70 md:block ${className}`}
        aria-label="이전 슬라이드"
      >
        <IoIosArrowBack />
      </button>
      <button
        onClick={onNextClick}
        className={`z-base absolute -right-10 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-skin-fill p-6 text-3xl text-black-accent opacity-0 transition-opacity duration-300 group-hover:opacity-70 md:block ${className}`}
        aria-label="다음 슬라이드"
      >
        <IoIosArrowForward />
      </button>
    </>
  );
};

export default SliderNavButtons;
