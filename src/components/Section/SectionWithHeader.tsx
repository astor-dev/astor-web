import React, { useRef } from "react";
import type { ReactNode } from "react";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";

interface SectionWithHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

const SectionWithHeader: React.FC<SectionWithHeaderProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={`relative space-y-12 py-16 transition-all duration-700 ${className} ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      {/* 헤더 영역 */}
      <div className="relative">
        {/* 작은 악센트 라인 */}
        <div className="mb-6">
          <div className="h-0.5 w-12 bg-skin-accent" />
        </div>

        {/* 제목과 설명 */}
        <div className="relative max-w-3xl">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-black-accent sm:text-5xl">
            {title}
          </h2>
          <p className="text-lg leading-relaxed text-black-base/80">
            {description}
          </p>
        </div>

        {/* 배경 장식 요소 */}
        <div className="from-skin-accent/5 pointer-events-none absolute -right-64 top-0 -z-10 h-[200px] w-[500px] rotate-12 bg-gradient-to-r to-transparent blur-3xl" />
      </div>

      {/* 컨텐츠 영역 */}
      {children && (
        <div className="relative">
          {children}
          {/* 배경 장식 요소 */}
          <div className="from-skin-accent/5 pointer-events-none absolute -left-64 bottom-0 -z-10 h-[200px] w-[500px] -rotate-12 bg-gradient-to-l to-transparent blur-3xl" />
        </div>
      )}
    </section>
  );
};

export default SectionWithHeader;
