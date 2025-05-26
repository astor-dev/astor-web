import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { HISTORY_DATA, type HistoryItem } from "~constants/history";

const HistoryTimeline: React.FC = () => {
  // 연도별로 그룹핑
  const historyByYear = HISTORY_DATA.reduce(
    (acc, item) => {
      const year = item.date.slice(0, 4);
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );

  const allYears = Object.keys(historyByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const [yearIdx, setYearIdx] = useState(0);
  const currentYear = allYears[yearIdx];

  // 현재 연도의 아이템들을 최신순으로 정렬
  const currentYearItems =
    historyByYear[currentYear]?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ) || [];

  // 월별로 그룹핑
  const itemsByMonth = currentYearItems.reduce(
    (acc, item) => {
      const month = item.date.slice(5, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );

  // 월을 내림차순으로 정렬 (12월부터 1월까지)
  const sortedMonths = Object.keys(itemsByMonth).sort(
    (a, b) => parseInt(b) - parseInt(a),
  );

  // 월을 영어로 변환
  const getMonthName = (monthNum: string) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return months[parseInt(monthNum) - 1] || monthNum;
  };

  return (
    <section className="w-full">
      <div className="text-black aspect-[4/3] overflow-hidden rounded-lg bg-white md:aspect-[4/3]">
        {/* 내부 그리드 - 반응형 */}
        <div className="grid h-full grid-cols-1 gap-0 md:grid-cols-3">
          {/* 년도 네비게이션 - 반응형 */}
          <div className="relative flex h-16 flex-row items-center justify-center bg-white py-4 md:h-full md:flex-col md:py-8">
            <button
              className="hover:text-black text-2xl text-gray-400 md:text-3xl"
              aria-label="이전 년도"
              onClick={() => setYearIdx(idx => Math.max(0, idx - 1))}
              disabled={yearIdx === 0}
            >
              <FaChevronUp className="hidden md:block" />
              <FaChevronUp className="-rotate-90 md:hidden" />
            </button>
            <div className="mx-8 flex flex-row items-center justify-center md:mx-0 md:flex-col">
              <span className="text-[40px] font-extrabold tracking-tight text-black-accent md:text-[80px]">
                {String(currentYear).slice(0, 2)}
              </span>
              <span className="text-[40px] font-extrabold tracking-tight text-black-base md:text-[80px]">
                {String(currentYear).slice(2, 4)}
              </span>
            </div>
            <button
              className="hover:text-black text-2xl text-gray-400 md:text-3xl"
              aria-label="다음 년도"
              onClick={() =>
                setYearIdx(idx => Math.min(allYears.length - 1, idx + 1))
              }
              disabled={yearIdx === allYears.length - 1}
            >
              <FaChevronDown className="hidden md:block" />
              <FaChevronDown className="-rotate-90 md:hidden" />
            </button>
          </div>

          {/* 연혁 타임라인 - 반응형 */}
          <div className="col-span-1 flex min-h-0 flex-col py-4 md:col-span-2 md:py-8">
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto px-4 md:px-6">
              <div className="relative space-y-4 md:space-y-6">
                {sortedMonths.map((month, index) => (
                  <div
                    key={month}
                    className={`timeline-item relative ${index < sortedMonths.length - 1 ? "has-line" : ""}`}
                  >
                    {/* 월 표시 */}
                    <div className="relative mb-2 md:mb-3">
                      {/* CSS로 원 그리기 */}
                      <div
                        className="timeline-circle absolute -left-1 top-1.5 z-10 h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: "var(--skin-accent, #747a86)",
                        }}
                      />
                      <span className="ml-3 text-sm font-bold text-skin-accent md:ml-4 md:text-base">
                        {getMonthName(month)}
                      </span>
                    </div>

                    {/* 해당 월의 아이템들 */}
                    <div className="ml-3 space-y-1 md:ml-4 md:space-y-1.5">
                      {itemsByMonth[month]
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime(),
                        )
                        .map(item => (
                          <div
                            key={item.date + item.text.slice(0, 5)}
                            className="text-xs leading-relaxed text-gray-700 md:text-xs"
                          >
                            {item.text}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                {currentYearItems.length === 0 && (
                  <div className="py-4 text-center text-sm text-gray-400 md:py-8 md:text-base">
                    해당 연도의 연혁이 없습니다.
                  </div>
                )}
              </div>

              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  .timeline-item.has-line::after {
                    content: '';
                    position: absolute;
                    top: 6px;
                    left: -0.5px;
                    width: 1px;
                    height: calc(100% + 16px);
                    background-color: var(--skin-accent, #747a86);
                    opacity: 0.6;
                    z-index: 1;
                  }
                  
                  @media (min-width: 768px) {
                    .timeline-item.has-line::after {
                      top: 8px;
                      height: calc(100% + 24px);
                    }
                  }
                `,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;
