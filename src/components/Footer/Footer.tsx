// src/components/Footer.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaArrowUp,
  FaClock,
} from "react-icons/fa";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import type { PostEntry } from "~/types/post.type";

// 최신 포스트 타입 정의 (간단한 버전)
interface LatestPost {
  id: string;
  title: string;
  date: string;
  image: string;
  url: string;
}

export default function Footer() {
  // 실제 구현에서는 API에서 가져오거나 props로 전달받을 수 있습니다
  const [latestPosts, setLatestPosts] = useState<LatestPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 예시 데이터 - 실제 구현에서는 API 호출로 대체
    const fetchLatestPosts = async () => {
      try {
        // 여기에 실제 API 호출 코드 추가
        // const response = await fetch('/api/latest-posts');
        // const data = await response.json();

        // 테스트용 더미 데이터
        const dummyData: LatestPost[] = [
          {
            id: "1",
            title: "리액트의 최신 동향과 트렌드",
            date: "2023-05-15",
            image: "/blog-img-1.jpg",
            url: "/blog/detail/1",
          },
          {
            id: "2",
            title: "TypeScript 4.9 새로운 기능 살펴보기",
            date: "2023-05-10",
            image: "/blog-img-2.jpg",
            url: "/blog/detail/2",
          },
          {
            id: "3",
            title: "웹 개발자를 위한 AI 도구 모음",
            date: "2023-05-05",
            image: "/blog-img-3.jpg",
            url: "/blog/detail/3",
          },
          {
            id: "4",
            title: "Next.js 14 업데이트 핵심 정리",
            date: "2023-04-28",
            image: "/blog-img-4.jpg",
            url: "/blog/detail/4",
          },
        ];

        setLatestPosts(dummyData);
        setIsLoading(false);
      } catch (error) {
        console.error("최신 포스트를 가져오는 중 오류 발생:", error);
        setIsLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <footer className="relative animate-gradientShift overflow-hidden bg-[linear-gradient(270deg,#0c1020,#12172e,#0c1020)] bg-[length:600%_600%]">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* 최신 포스트 그리드 섹션 */}
        <div className="py-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 text-center text-2xl font-bold text-white-base"
          >
            최신 포스트
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="h-[200px] animate-pulse rounded-lg bg-white/10"
                    ></div>
                  ))
              : latestPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Number(post.id) * 0.1 }}
                    className="group overflow-hidden rounded-lg bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <a href={post.url} className="block h-full">
                      <div className="relative h-24 overflow-hidden">
                        <ImageWithSkeleton
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 min-h-[3rem] text-sm font-bold text-white-base group-hover:text-skin-accent">
                          {post.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-1 text-xs text-white-base/70">
                          <FaClock className="h-3 w-3" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("ko-KR")}
                          </time>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="mx-auto h-px w-full max-w-4xl bg-white/10"></div>

        {/* 기존 푸터 정보 */}
        <div className="py-10 text-center">
          {/* 로고 및 슬로건 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-4 text-4xl font-bold text-skin-accent"
          >
            Astor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8 text-xl text-white-base/70"
          >
            Dream. Create. Inspire.
          </motion.p>

          {/* 소셜 아이콘 */}
          <div className="mb-8 flex justify-center space-x-6">
            <motion.a
              href="https://github.com/astorverse"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white-base transition-colors hover:text-skin-accent"
            >
              <FaGithub className="h-6 w-6" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/astorverse"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white-base transition-colors hover:text-skin-accent"
            >
              <FaLinkedin className="h-6 w-6" />
            </motion.a>
            <motion.a
              href="mailto:orangnlp@gmail.com"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white-base transition-colors hover:text-skin-accent"
            >
              <FaEnvelope className="h-6 w-6" />
            </motion.a>
          </div>

          {/* 네비게이션 */}
          <nav className="mb-8">
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-8">
              <li>
                <a
                  href="/blog"
                  className="text-white-base/70 transition-colors hover:text-skin-accent"
                >
                  블로그
                </a>
              </li>
              <li>
                <a
                  href="/portfolio"
                  className="text-white-base/70 transition-colors hover:text-skin-accent"
                >
                  포트폴리오
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white-base/70 transition-colors hover:text-skin-accent"
                >
                  소개
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-white-base/70 transition-colors hover:text-skin-accent"
                >
                  연락처
                </a>
              </li>
            </ul>
          </nav>

          {/* 스크롤 투 탑 버튼 */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white mx-auto mb-8 flex items-center space-x-2 rounded-full border border-white/30 px-4 py-2 text-sm transition-colors hover:border-skin-accent hover:text-skin-accent"
          >
            <FaArrowUp className="h-4 w-4" />
            <span>맨 위로 이동</span>
          </motion.button>

          {/* 카피라이트 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs text-white-base/50"
          >
            © {new Date().getFullYear()} Astor. 모든 권리 보유.
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
