import React from "react";
import Button from "~components/Button/Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline"],
    },
    children: { control: "text" },
    onClick: { action: "clicked" },
    className: { control: "text" },
  },
};

// 기본 템플릿
const Template = args => <Button {...args} />;

// Primary 버튼
export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  children: "기본 버튼",
};

// Secondary 버튼
export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  children: "보조 버튼",
};

// Outline 버튼
export const Outline = Template.bind({});
Outline.args = {
  variant: "outline",
  children: "외곽선 버튼",
};
