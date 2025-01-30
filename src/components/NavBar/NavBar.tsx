import React, { useState, useEffect, useRef } from "react";
import throttle from "lodash/throttle";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import logo from "~assets/svgs/logo.svg";

interface NavBarProps {
  pathname: string; // 현재 경로를 전달받음
  initialShowNav?: boolean; // 초기 표시 여부를 전달받음 (optional)
}

export default function NavBar({
  initialShowNav = false,
  pathname,
}: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false); // 다크모드 상태
  const [showNav, setShowNav] = useState(initialShowNav);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // 로컬 스토리지에서 다크모드 설정 불러오기
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDark(true);
    } else if (savedTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      setIsDark(false);
    } else {
      // 브라우저 기본 다크모드 설정 확인
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light",
      );
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setShowNav(false); // 스크롤 내리면 NavBar 숨김
      } else {
        setShowNav(true); // 스크롤 올리면 NavBar 보임
      }
      lastScrollY.current = currentScrollY;
    }, 200); // 200ms 간격으로 throttle

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeToggle = () => {
    const currentTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme); // 로컬 스토리지에 테마 저장
    setIsDark(!isDark);
  };

  const menuItems = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
  ];

  const isActive = (href: string) => {
    const lowerCasePathname = pathname.toLowerCase();
    const lowerCaseHref = href.toLowerCase();
    if (lowerCaseHref === "/") {
      return lowerCasePathname === "/";
    }
    return lowerCasePathname.startsWith(lowerCaseHref);
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
          <a
            href="/"
            className="flex items-center text-2xl font-extrabold text-black-accent"
          >
            {/* <img src={logo.src} alt="astor" className="mr-2 h-8 w-8" /> */}
            <span>Astor</span>
          </a>

          {/* PC용 메뉴 */}
          <div className="hidden space-x-6 sm:flex">
            {menuItems.slice(0, 3).map(item => (
              <a
                key={item.name}
                href={item.href}
                className={`text-lg font-medium transition hover:text-skin-secondary ${
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
            className="hover:bg-skin-card-muted rounded p-2 text-skin-base transition hover:text-skin-accent focus:outline-none"
          >
            {isDark ? (
              <RiSunFill className="h-6 w-6 stroke-current" />
            ) : (
              <RiMoonClearFill className="h-6 w-6 stroke-current" />
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
                className={`text-lg font-medium transition hover:text-skin-secondary ${
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
