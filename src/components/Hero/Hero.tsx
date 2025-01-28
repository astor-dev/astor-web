// components/Hero.jsx
import React, { useEffect, useState } from "react";
import FloatingIcons from "~components/Hero/FloatingIcons";
import heroMilkyway from "~assets/images/hero-milkyway.jpg";
import {
  SiDocker,
  SiGit,
  SiGithub,
  SiJavascript,
  SiKubernetes,
  SiNestjs,
  SiNginx,
  SiPagespeedinsights,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 클라이언트에서 마운트된 후에 상태를 업데이트
    setIsMounted(true);
  }, []);

  // 아이콘 타입 배열
  const iconTypes = [
    SiDocker,
    SiGit,
    SiGithub,
    SiJavascript,
    SiKubernetes,
    SiNestjs,
    SiNginx,
    SiPagespeedinsights,
    SiPython,
    SiReact,
    SiTailwindcss,
    SiTypescript,
  ];

  // 색상 배열
  const iconColors = [
    "text-yellow-400/100",
    "text-blue-500/100",
    "text-purple-400/100",
    "text-green-400/100",
    "text-pink-400/100",
    "text-indigo-400/100",
    "text-cyan-400/100",
    "text-teal-400/100",
    "text-orange-400/100",
  ];

  // 크기 배열
  const iconSizes = [
    "h-5 w-5",
    "h-6 w-6",
    "h-7 w-7",
    "h-8 w-8",
    "h-9 w-9",
    "h-10 w-10",
  ];

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-skin-fill">
      {/* 배경 이미지 */}
      <picture>
        <source
          srcSet={heroMilkyway.src}
          type="image/webp"
          sizes="(max-width: 1024px) 100vw, 1920px"
        />
        <img
          src={heroMilkyway.src}
          alt="Hero 배경 이미지"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </picture>
      {/* 어두운 오버레이 레이어 */}
      <div className="absolute inset-0 z-10 bg-black opacity-50"></div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-80">
        <FloatingIcons
          iconTypes={iconTypes}
          iconColors={iconColors}
          iconSizes={iconSizes}
        />
      </div>

      {/* 메인 콘텐츠 (텍스트 + CTA 버튼) */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        <h1
          className={`mb-6 text-5xl font-extrabold tracking-widest sm:text-6xl md:text-7xl ${
            isMounted ? "animate-fadeInDown-1s" : ""
          }`}
          style={{ color: "#F5F5F7" }}
        >
          Implode()
        </h1>
        <p
          className={`text-white mb-12 max-w-2xl text-lg font-light text-white-base sm:text-xl md:text-2xl ${
            isMounted ? "animate-fadeInUp-1.2s" : ""
          }`}
          style={{ color: "#F2F2F5" }}
        >
          안녕하세요!{" "}
          <span className="font-semibold">백엔드 개발자 Astoir, 김도훈</span>
          입니다.
          <br />
          문제의 복잡함을 꿰뚫어보고,{" "}
          <span className="font-semibold">간결하고 명확한 구조</span>로
          <br />
          현실에 녹아들 수 있는 솔루션을 만듭니다.
        </p>

        {/* CTA 버튼 (하나만 남김) */}
        <div className={`${isMounted ? "animate-fadeInUp-1.4s" : ""}`}>
          <a
            href="/projects"
            className="rounded-full bg-skin-accent px-10 py-4 text-sm font-semibold text-white-base shadow-lg transition hover:bg-skin-accent/90 active:scale-95"
            style={{ color: "#F5F5F7" }}
          >
            프로젝트 보러가기
          </a>
        </div>
      </div>
    </section>
  );
}
