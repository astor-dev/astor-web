import React from "react";
import Card from "~components/Card/Card";

export default {
  title: "Components/Card",
  component: Card,
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    children: { control: "text" },
    className: { control: "text" },
  },
};

const Template = args => <Card {...args} />;

// 기본 카드
export const Default = Template.bind({});
Default.args = {
  title: "카드 제목",
  subtitle: "카드 부제목",
  children: "카드 내용이 여기에 들어갑니다.",
};

// 제목만 있는 카드
export const TitleOnly = Template.bind({});
TitleOnly.args = {
  title: "제목만 있는 카드",
  children: "카드 내용입니다.",
};

// 내용만 있는 카드
export const ContentOnly = Template.bind({});
ContentOnly.args = {
  children: "제목 없이 내용만 있는 카드입니다.",
};
