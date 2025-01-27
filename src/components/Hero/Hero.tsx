// components/Hero.jsx
import {
  CloudIcon,
  CodeBracketIcon,
  ServerIcon,
  StarIcon,
  CommandLineIcon,
  CpuChipIcon,
  CubeIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import FloatingIcons from "~components/Icon/FloatingIcon";

export default function Hero() {
  const icons = [
    {
      Icon: StarIcon,
      color: "text-yellow-400/80",
      size: "h-6 w-6",
      top: "5%",
      left: "10%",
    },
    {
      Icon: ServerIcon,
      color: "text-blue-500/80",
      size: "h-8 w-8",
      top: "20%",
      left: "40%",
    },
    {
      Icon: CloudIcon,
      color: "text-purple-400/80",
      size: "h-10 w-10",
      top: "15%",
      left: "85%",
    },
    {
      Icon: CodeBracketIcon,
      color: "text-green-400/80",
      size: "h-8 w-8",
      top: "70%",
      left: "25%",
    },
    {
      Icon: CommandLineIcon,
      color: "text-pink-400/80",
      size: "h-7 w-7",
      top: "65%",
      left: "80%",
    },
    {
      Icon: CpuChipIcon,
      color: "text-indigo-400/80",
      size: "h-9 w-9",
      top: "40%",
      left: "75%",
    },
    {
      Icon: CubeIcon,
      color: "text-cyan-400/80",
      size: "h-8 w-8",
      top: "85%",
      left: "55%",
    },
    {
      Icon: GlobeAltIcon,
      color: "text-teal-400/80",
      size: "h-10 w-10",
      top: "10%",
      left: "65%",
    },
    {
      Icon: RocketLaunchIcon,
      color: "text-orange-400/80",
      size: "h-8 w-8",
      top: "50%",
      left: "15%",
    },
    {
      Icon: StarIcon,
      color: "text-yellow-400/80",
      size: "h-5 w-5",
      top: "75%",
      left: "45%",
    },
    {
      Icon: ServerIcon,
      color: "text-blue-500/80",
      size: "h-6 w-6",
      top: "40%",
      left: "95%",
    },
    {
      Icon: CloudIcon,
      color: "text-purple-400/80",
      size: "h-7 w-7",
      top: "90%",
      left: "80%",
    },
  ];

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-skin-fill bg-[url('/hero-milkyway.jpg')]">
      {/* 배경 레이어 (아이콘 + 펄스 그라디언트) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="via-skin-accent/20 animate-pulseCustom absolute inset-0 z-0 bg-gradient-to-r from-transparent to-transparent" />
        <FloatingIcons icons={icons} />
      </div>

      {/* 메인 콘텐츠 (텍스트 + CTA 버튼) */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        <h1 className="text-skin-white-accent animate-fadeInDown-1s mb-6 text-5xl font-extrabold tracking-widest sm:text-6xl md:text-7xl">
          CELESTIAL COUTURE
        </h1>
        <p className="text-skin-white animate-fadeInUp-1.2s mb-12 max-w-2xl text-lg font-light sm:text-xl md:text-2xl">
          Where cosmic imagination collides with modern web innovation.
          <br />
          Step into our endless universe and experience
          <span className="text-skin-white-accent font-semibold">
            {" "}
            boundless creativity
          </span>
          .
        </p>
        {/* CTA 버튼 (하나만 남김) */}
        <div className="animate-fadeInUp-1.4s">
          <a
            href="#explore"
            className="text-skin-white rounded-full bg-skin-accent px-10 py-4 text-sm font-semibold shadow-lg transition hover:bg-skin-accent/90 active:scale-95"
          >
            Explore The Universe
          </a>
        </div>
      </div>
    </section>
  );
}
