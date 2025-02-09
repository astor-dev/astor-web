// src/components/Footer.jsx
import React from "react";
import { getPosts } from "~utils/getPosts";
import dayjs from "dayjs";
import { FaGithub, FaRss } from "react-icons/fa";
import { PiShootingStarFill } from "react-icons/pi";

export default async function Footer() {
  // 최근 글 5개 가져오기
  const recentPosts = await getPosts({
    filter: { draft: false },
    sort: { by: "createdAt", order: "desc" },
    paging: { page: 1, limit: 5 },
  });

  return (
    <footer className="bg-skin-card border-t border-skin-line">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 블로그 정보 */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <span className="text-xl font-bold text-skin-accent">astoir</span>
            </div>
            <p className="mb-4 text-sm text-skin-base/70">
              개발자의 성장 이야기를 담는 공간
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-skin-base/70 transition-colors hover:text-skin-accent"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="/rss.xml"
                className="text-skin-base/70 transition-colors hover:text-skin-accent"
              >
                <FaRss className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 최근 글 */}
          <div className="lg:col-span-5">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-skin-base">
              <PiShootingStarFill className="text-skin-accent" />
              최근 글
            </h3>
            <div className="space-y-3">
              {recentPosts.map(post => (
                <a
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group block"
                >
                  <h4 className="text-sm font-medium text-skin-base transition-colors group-hover:text-skin-accent">
                    {post.data.title}
                  </h4>
                  <p className="text-xs text-skin-base/60">
                    {dayjs(post.data.createdAt).format("YYYY년 MM월 DD일")}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* 링크 모음 */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-base font-semibold text-skin-base">
              사이트맵
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/blog"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  블로그
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  프로젝트
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  소개
                </a>
              </li>
            </ul>
          </div>

          {/* 법적 정보 */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-base font-semibold text-skin-base">
              법적 고지
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/privacy"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="mt-8 border-t border-skin-line pt-8 text-center text-sm text-skin-base/60">
          © {new Date().getFullYear()} astoir. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
