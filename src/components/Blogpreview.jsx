// src/components/BlogPreview.jsx
import React from "react";

export default function BlogPreview() {
  return (
    <section className="container mx-auto py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">BLOG</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {/* 역시 실제 블로그 포스트 데이터에 맞춰 맵핑 가능 */}
        <article className="shadow rounded bg-white p-4">
          <h3 className="mb-2 text-xl font-semibold">블로그 포스트 1</h3>
          <p className="text-gray-600">
            여기는 블로그 포스트에 대한 간단 요약...
          </p>
        </article>
        <article className="shadow rounded bg-white p-4">
          <h3 className="mb-2 text-xl font-semibold">블로그 포스트 2</h3>
          <p className="text-gray-600">
            여기는 블로그 포스트에 대한 간단 요약...
          </p>
        </article>
      </div>
    </section>
  );
}
