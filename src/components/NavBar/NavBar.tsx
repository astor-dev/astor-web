import React, { useState, useEffect, useRef } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // NavBar 보여줄지 말지 결정하는 상태
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // 현재 테마 확인
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "dark");
  }, []);

  // 스크롤 이벤트로 NavBar 숨김/보임 제어
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        // 스크롤 ‘내려가는’ 중이면 NavBar 숨김
        setShowNav(false);
      } else {
        // 스크롤 ‘올라가는’ 중이면 NavBar 보임
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 테마 토글
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

  return (
    // showNav 상태에 따라 transform이 달라지도록
    // position을 fixed로 해서 스크롤 이동시에도 항상 상단에 위치
    <header
      className={`fixed left-0 top-0 z-50 w-full transform transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      } bg-skin-fill`}
    >
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-bold text-skin-accent">
          Astoir
        </a>

        {/* 데스크톱용 메뉴 */}
        <div className="hidden space-x-6 sm:flex">
          <a
            href="#"
            className="text-skin-base transition hover:text-skin-accent"
          >
            About
          </a>
          <a
            href="#"
            className="text-skin-base transition hover:text-skin-accent"
          >
            Blog
          </a>
          <a
            href="#"
            className="text-skin-base transition hover:text-skin-accent"
          >
            Contact
          </a>
        </div>

        {/* 오른쪽 아이콘들 */}
        <div className="flex items-center space-x-4">
          {/* 테마 토글 버튼 */}
          <button
            onClick={handleThemeToggle}
            className="rounded p-2 text-skin-base transition hover:bg-skin-card-muted hover:text-skin-accent focus:outline-none"
          >
            {isDark ? (
              // Light 모드로 전환 아이콘 (Sun)
              <svg
                className="h-6 w-6 stroke-current"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l1.414-1.414M6.05 6.05l1.414 1.414"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // Dark 모드로 전환 아이콘 (Moon)
              <svg
                className="h-6 w-6 stroke-current"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9 9 0 1019.06 16.94c.456-.188.892-.414 1.294-.686z"
                />
              </svg>
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
            <a
              href="#"
              className="text-skin-base transition hover:text-skin-accent"
            >
              About
            </a>
            <a
              href="#"
              className="text-skin-base transition hover:text-skin-accent"
            >
              Blog
            </a>
            <a
              href="#"
              className="text-skin-base transition hover:text-skin-accent"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
