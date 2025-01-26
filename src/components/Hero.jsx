// src/components/Hero.jsx
import React from "react";

export default function Hero() {
  return (
    <section className="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-center text-white">
      <h1 className="mb-4 text-5xl font-bold">
        안녕하세요, astoir의 개발 블로그입니다!
      </h1>
      <p className="text-xl">
        모던하고 깔끔한 디자인으로 제작된 블로그 & 포트폴리오에 오신 것을
        환영합니다.
      </p>
    </section>
  );
}
