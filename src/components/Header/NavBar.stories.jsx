import React from "react";
import NavBar from "~components/Header/NavBar";

export default {
  title: "Components/NavBar",
  component: NavBar,
  parameters: {
    layout: "fullscreen",
  },
};

// 기본 네비게이션 바
export const Default = () => <NavBar />;

// 다크 모드 네비게이션 바
export const DarkMode = () => {
  // 스토리가 마운트될 때 다크 모드로 설정
  document.documentElement.setAttribute("data-theme", "dark");
  return <NavBar />;
};
DarkMode.parameters = {
  backgrounds: { default: "dark" },
};

// 라이트 모드 네비게이션 바
export const LightMode = () => {
  // 스토리가 마운트될 때 라이트 모드로 설정
  document.documentElement.setAttribute("data-theme", "light");
  return <NavBar />;
};
