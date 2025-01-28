import React from "react";
import AstoirLogo from "./Logo";

export default {
  title: "Components/Logo",
  component: AstoirLogo,
};

// 기본 로고
export const Default = () => <AstoirLogo />;

// 작은 크기 로고
export const Small = () => <AstoirLogo width={100} height={67} />;

// 큰 크기 로고
export const Large = () => <AstoirLogo width={450} height={300} />;
