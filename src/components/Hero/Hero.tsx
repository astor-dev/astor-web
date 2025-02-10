import React, { useEffect, useState } from "react";
import FloatingIcons from "~components/Hero/FloatingIcons";
import heroMilkyway from "~assets/images/hero-milkyway.jpg";
import LoadingSpinner from "~components/LoadingSpinner/LoadingSpinner";
import { stacks } from "~constants/stacks";
import type { IconType } from "react-icons";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = heroMilkyway.src;
    img.onload = () => {
      setIsLoading(false);
    };
  }, []);

  const icons: { icon: IconType; color: string }[] = stacks.map(stack => ({
    icon: stack.icon,
    color: stack.color,
  }));

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
      <picture>
        <img
          src={heroMilkyway.src}
          alt="Hero 배경 이미지"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? "none" : "block" }}
        />
      </picture>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <LoadingSpinner className="h-full w-full" />
        </div>
      ) : (
        <>
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 z-10 bg-black opacity-50"></div>

          {/* 플로팅 아이콘 */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-80">
            <FloatingIcons icons={icons} iconSizes={iconSizes} />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
            <h1
              className="mb-6 text-5xl font-extrabold tracking-widest sm:text-6xl md:text-7xl"
              style={{ color: "#F5F5F7" }}
            >
              Implode()
            </h1>
            <p
              className="text-white mb-12 max-w-2xl text-base font-light text-white-base sm:text-lg md:text-2xl"
              style={{ color: "#F2F2F5" }}
            >
              안녕하세요!{" "}
              <span className="font-semibold">
                백엔드 개발자 Astor, 김도훈{" "}
              </span>
              입니다.
              <br />
              문제의 복잡함을 꿰뚫어보고,
              <span className="font-semibold">간결하고 명확한 구조</span>로
              <br />
              현실에 녹아들 수 있는 솔루션을 만듭니다.
            </p>

            <div>
              <a
                href="/blog"
                className="rounded-full bg-skin-accent px-10 py-4 text-sm font-semibold text-white-base shadow-lg transition hover:bg-skin-accent/90 active:scale-95"
                style={{ color: "#F5F5F7" }}
              >
                게시글 보러가기
              </a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
