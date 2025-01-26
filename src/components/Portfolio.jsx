// src/components/Portfolio.jsx
import React from "react";

export default function Portfolio() {
  return (
    <section className="container mx-auto py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">PORTFOLIO</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {/* 실제로는 DB나 API에서 포폴 데이터를 가져와서 맵핑하는 식으로 구현 가능 */}
        <div className="shadow rounded bg-white p-4">
          <h3 className="mb-2 text-xl font-semibold">프로젝트 1</h3>
          <p>간단 소개 문구</p>
        </div>
        <div className="shadow rounded bg-white p-4">
          <h3 className="mb-2 text-xl font-semibold">프로젝트 2</h3>
          <p>간단 소개 문구</p>
        </div>
        <div className="shadow rounded bg-white p-4">
          <h3 className="mb-2 text-xl font-semibold">프로젝트 3</h3>
          <p>간단 소개 문구</p>
        </div>
      </div>
    </section>
  );
}
