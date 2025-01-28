import React from "react";
import Accordion from "./Accordion";

export default {
  title: "Components/Accordion",
  component: Accordion,
};

const items = [
  {
    title: "첫 번째 항목",
    content: "첫 번째 항목의 내용입니다.",
  },
  {
    title: "두 번째 항목",
    content: "두 번째 항목의 내용입니다.",
  },
  {
    title: "세 번째 항목",
    content: (
      <div>
        <h3>복잡한 내용</h3>
        <p>HTML 요소를 포함한 내용도 표시할 수 있습니다.</p>
      </div>
    ),
  },
];

// 기본 아코디언
export const Default = () => <Accordion items={items} />;

// 단일 항목 아코디언
export const SingleItem = () => <Accordion items={[items[0]]} />;
