// components/Hero.jsx
import React, { useEffect, useState } from "react";
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
import { HiStar } from "react-icons/hi";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 아이콘 설정 배열
  const floatingIcons = [
    { Icon: SiNestjs, color: "text-red-500", size: "w-8 h-8", delay: "0s" },
    {
      Icon: SiJavascript,
      color: "text-yellow-400",
      size: "w-10 h-10",
      delay: "0.2s",
    },
    {
      Icon: SiTypescript,
      color: "text-blue-500",
      size: "w-6 h-6",
      delay: "0.4s",
    },
    {
      Icon: SiPython,
      color: "text-yellow-500",
      size: "w-12 h-12",
      delay: "0.6s",
    },
    { Icon: SiReact, color: "text-cyan-400", size: "w-9 h-9", delay: "0.8s" },
    {
      Icon: SiTailwindcss,
      color: "text-teal-400",
      size: "w-7 h-7",
      delay: "1s",
    },
    { Icon: SiDocker, color: "text-blue-400", size: "w-8 h-8", delay: "1.2s" },
    {
      Icon: SiKubernetes,
      color: "text-blue-500",
      size: "w-10 h-10",
      delay: "1.4s",
    },
    { Icon: SiGit, color: "text-orange-500", size: "w-6 h-6", delay: "1.6s" },
    { Icon: SiGithub, color: "text-gray-200", size: "w-8 h-8", delay: "1.8s" },
    { Icon: SiNginx, color: "text-green-400", size: "w-7 h-7", delay: "2s" },
    {
      Icon: SiPagespeedinsights,
      color: "text-blue-300",
      size: "w-9 h-9",
      delay: "2.2s",
    },
    { Icon: HiStar, color: "text-yellow-300", size: "w-5 h-5", delay: "2.4s" },
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

      {/* 떠다니는 아이콘들 */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {floatingIcons.map(({ Icon, color, size, delay }, index) => {
          // 각 아이콘의 기본 각도를 균등하게 분배
          const baseAngle = (index / floatingIcons.length) * 2 * Math.PI;
          // 기본 각도에 약간의 랜덤성 추가 (-15도 ~ +15도)
          const randomAngleOffset = ((Math.random() - 0.5) * Math.PI) / 6;
          const angle = baseAngle + randomAngleOffset;

          // 반지름 범위 설정 (20% ~ 45% of viewport)
          const minRadius = 20;
          const maxRadius = 45;
          const radius =
            minRadius + Math.pow(Math.random(), 0.8) * (maxRadius - minRadius);

          const top = 50 + radius * Math.sin(angle);
          const left = 50 + radius * Math.cos(angle);

          return (
            <div
              key={index}
              className={`animate-float absolute opacity-0 ${color} ${size}`}
              style={{
                left: `${Math.min(Math.max(left, 10), 90)}%`,
                top: `${Math.min(Math.max(top, 10), 90)}%`,
                animationDelay: delay,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            >
              <Icon className="transition-transform hover:scale-110" />
            </div>
          );
        })}
      </div>

      {/* 메인 콘텐츠 (텍스트 + CTA 버튼) */}
      <div className="relative z-30 mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        <h1
          className={`mb-6 text-5xl font-extrabold tracking-widest sm:text-6xl md:text-7xl ${
            isMounted ? "animate-fadeInDown-1s" : "opacity-0"
          }`}
          style={{ color: "#F5F5F7" }}
        >
          Implode()
        </h1>
        <p
          className={`text-white mb-12 max-w-2xl text-lg font-light text-white-base sm:text-xl md:text-2xl ${
            isMounted ? "animate-fadeInUp-1.2s" : "opacity-0"
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
        <div className={isMounted ? "animate-fadeInUp-1.4s" : "opacity-0"}>
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
