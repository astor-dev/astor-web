import React from "react";
import Tabs from "./Tabs";

export default {
  title: "Components/Tabs",
  component: Tabs,
};

const tabs = [
  {
    label: "첫 번째 탭",
    content: <div>첫 번째 탭의 내용입니다.</div>,
  },
  {
    label: "두 번째 탭",
    content: <div>두 번째 탭의 내용입니다.</div>,
  },
  {
    label: "세 번째 탭",
    content: (
      <div>
        <h3>복잡한 내용</h3>
        <p>HTML 요소를 포함한 내용도 표시할 수 있습니다.</p>
      </div>
    ),
  },
];

// 기본 탭
export const Default = () => <Tabs tabs={tabs} />;

// 두 개의 탭
export const TwoTabs = () => <Tabs tabs={tabs.slice(0, 2)} />;
