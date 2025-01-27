import React from "react";
import Footer from "./Footer";

export default {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

// 기본 푸터
export const Default = () => <Footer />;

// 다크 모드 푸터
export const DarkMode = () => {
  // 스토리가 마운트될 때 다크 모드로 설정
  document.documentElement.setAttribute("data-theme", "dark");
  return <Footer />;
};
DarkMode.parameters = {
  backgrounds: { default: "dark" },
};

// 라이트 모드 푸터
export const LightMode = () => {
  // 스토리가 마운트될 때 라이트 모드로 설정
  document.documentElement.setAttribute("data-theme", "light");
  return <Footer />;
};
