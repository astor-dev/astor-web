import React from "react";
import SearchBar from "./SearchBar";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
};

// 기본 검색바
export const Default = () => (
  <SearchBar onSearch={keyword => console.log("검색어:", keyword)} />
);

// 넓은 검색바
export const Wide = () => (
  <div className="w-[500px]">
    <SearchBar onSearch={keyword => console.log("검색어:", keyword)} />
  </div>
);
