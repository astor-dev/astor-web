import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
};

// 기본 스피너
export const Default = () => <LoadingSpinner />;

// 컨테이너 안의 스피너
export const InContainer = () => (
  <div className="h-64 w-64 border border-gray-200">
    <LoadingSpinner />
  </div>
);
