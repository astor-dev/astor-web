// components/NavBar.jsx
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import React, { useState, useEffect, useRef } from "react";
import throttle from "lodash/throttle";

interface NavBarProps {
  pathname: string; // 현재 경로를 전달받음
  initialShowNav?: boolean; // 초기 표시 여부를 전달받음 (optional)
}

export default function NavBar({
  initialShowNav = false,
  pathname,
}: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showNav, setShowNav] = useState(initialShowNav);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // 현재 테마 확인
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "dark");
  }, []);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        // 스크롤 ‘내려가는’ 중이면 NavBar 숨김
        setShowNav(false);
      } else {
        // 스크롤 ‘올라가는’ 중이면 NavBar 보임
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    }, 200); // 200ms 간격으로 throttle

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeToggle = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDark(true);
    }
  };

  // 메뉴 항목 배열
  const menuItems = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }, // 모바일 메뉴에만 추가된 Contact
  ];

  // 활성화된 메뉴 확인 함수
  const isActive = (href: string) => {
    const lowerCasePathname = pathname.toLowerCase();
    const lowerCaseHref = href.toLowerCase();
    if (lowerCaseHref === "/") {
      return lowerCasePathname === "/";
    }
    const match = lowerCasePathname.startsWith(lowerCaseHref);
    return match;
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transform transition-transform duration-300 ease-in-out will-change-transform ${
        showNav ? "translate-y-0" : "-translate-y-full"
      } bg-skin-fill shadow-md`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        {/* 로고 섹션 */}
        <div className="flex items-center space-x-12">
          <a href="/" className={`text-black-accent text-2xl font-extrabold`}>
            Astoir
          </a>

          {/* PC용 메뉴 */}
          <div className="hidden space-x-6 sm:flex">
            {menuItems.slice(0, 3).map(item => (
              <a
                key={item.name}
                href={item.href}
                className={`hover:text-skin-secondary text-lg font-medium transition ${
                  isActive(item.href) ? "text-skin-accent" : "text-black-base"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* 오른쪽 아이콘들 */}
        <div className="flex items-center space-x-4">
          {/* 테마 토글 버튼 */}
          <button
            onClick={handleThemeToggle}
            className="rounded p-2 text-skin-base transition hover:bg-skin-card-muted hover:text-skin-accent focus:outline-none"
          >
            {isDark ? (
              <SunIcon className="h-6 w-6 stroke-current" />
            ) : (
              <MoonIcon className="h-6 w-6 stroke-current" />
            )}
          </button>

          {/* 모바일 메뉴 토글 버튼 */}
          <button
            className="focus:outline-none sm:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Toggle Menu</span>
            <svg
              className="h-6 w-6 stroke-current text-skin-base"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 (isOpen true면 열림) */}
      {isOpen && (
        <div className="border-t border-skin-line sm:hidden">
          <div className="flex flex-col space-y-2 px-4 py-3">
            {menuItems.map(item => (
              <a
                key={item.name}
                href={item.href}
                className={`hover:text-skin-secondary text-lg font-medium transition ${
                  isActive(item.href) ? "text-skin-accent" : "text-black-base"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
