import React, { useState, useEffect, useRef } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import IconDropdown from "~components/Dropdown/IconDropdown";

// Constants
const BREAKPOINT_MD = 768;
const HERO_HEIGHT_MOBILE = 450;
const HERO_HEIGHT_DESKTOP = 500;
const BLOG_MAIN_HEIGHT = 1;
const isBlogNoHeroPage = (pathname: string): boolean => {
  return (
    pathname.match(/^\/blog(?!\/posts(?:\/|$))(?!\/series\/.+).*/) !== null
  );
};

const isProjectNoHeroPage = (pathname: string): boolean => {
  return pathname === "/projects" || pathname === "/projects/";
};

const isNoHeroPage = (pathname: string): boolean => {
  // blog/posts/* || blog/series/* 제외한 모든 블로그 페이지 + project 메인 페이지 (/projects)
  console.log("pathname", pathname);
  return isBlogNoHeroPage(pathname) || isProjectNoHeroPage(pathname);
};

const isAdminPage = (pathname: string): boolean => {
  return pathname.includes("/admin");
};

const isAboutPage = (pathname: string): boolean => {
  return pathname === "/about" || pathname === "/about/";
};

const getHeroHeight = (pathname: string): number => {
  if (window.innerWidth >= BREAKPOINT_MD) {
    if (isNoHeroPage(pathname)) {
      return BLOG_MAIN_HEIGHT;
    }
    return HERO_HEIGHT_DESKTOP;
  } else {
    if (isNoHeroPage(pathname)) {
      return BLOG_MAIN_HEIGHT;
    }
    return HERO_HEIGHT_MOBILE;
  }
};

const calculateIsInHero = (pathname: string, scrollY: number): boolean => {
  const heroHeight = getHeroHeight(pathname);

  if (scrollY < heroHeight || isAdminPage(pathname)) {
    // Hero 영역에 있거나 관리자 페이지인 경우
    return true;
  }

  // 스크롤이 Hero 영역을 벗어난 경우
  return false;
};

interface NavBarProps {
  pathname: string;
}

const NavBar = ({ pathname }: NavBarProps) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isTextWhite, setIsTextWhite] = useState(true);
  const navBarRef = useRef<HTMLDivElement>(null);

  // 현재 경로 체크 헬퍼 함수
  const isActiveRoute = (route: string): boolean => {
    if (route === "/") {
      return pathname === "/" || pathname === "";
    }
    if (route === "/blog") {
      return isBlogNoHeroPage(pathname);
    }
    return pathname === route || pathname === `${route}/`;
  };

  // 활성화 메뉴 스타일 생성 함수
  const getMenuItemClassName = (route: string): string => {
    const baseClass = "text-sm font-medium hover:text-skin-accent";
    const activeClass = "text-skin-accent font-semibold";
    return isActiveRoute(route) ? `${baseClass} ${activeClass}` : baseClass;
  };

  // 모바일 메뉴 활성화 스타일 생성 함수
  const getMobileMenuItemClassName = (route: string): string => {
    const baseClass = "block text-sm text-black-base hover:underline";
    const activeClass = "text-skin-accent font-semibold";
    return isActiveRoute(route) ? `${baseClass} ${activeClass}` : baseClass;
  };

  // 로그인 쿠키 감지
  useEffect(() => {
    if (document.cookie.indexOf("isLoggedIn=true") !== -1) {
      setShowAdmin(true);
    }
    if (
      document.cookie.indexOf("hasLoggedInOnce=true") !== -1 && // 최초 로그인 후 30일 동안 유지
      document.cookie.indexOf("isLoggedIn=true") === -1 // 로그인이 되어있지 않다면
    ) {
      setShowLogin(true);
    }
  }, []);

  const [isInHero, setIsInHero] = useState(true);
  const [shouldHideNavBar, setShouldHideNavBar] = useState(true);

  // 스크롤 위치와 URL에 따른 네브바 상태 관리
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const newIsInHero = calculateIsInHero(pathname, window.scrollY);
          setIsInHero(newIsInHero);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    setShouldHideNavBar(isAboutPage(pathname));
    setIsTextWhite(!isNoHeroPage(pathname));

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header
      ref={navBarRef}
      className={`left-1/2 z-30 w-full -translate-x-1/2 print:hidden ${
        isInHero
          ? shouldHideNavBar
            ? "pointer-events-none absolute opacity-0"
            : `absolute bg-opacity-0 ${
                isTextWhite ? "text-white-base" : "text-black-base"
              }`
          : `fixed bg-white text-black-base shadow-[inset_0_-1px_0_0_rgb(229,231,235)]`
      }`}
    >
      {/* BaseLayout과 동일한 max-width와 패딩 적용 */}
      <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-1 md:px-6 md:py-3">
        {/* 왼쪽: 로고 */}
        <div className="flex-shrink-0">
          <a href="/" title="홈" className={`font-logo text-lg md:text-2xl`}>
            astor-dev
          </a>
        </div>

        {/* 오른쪽: 네비게이션 메뉴 */}
        <div className="flex items-center">
          {/* PC용 펼친 메뉴 (md 이상에서만 보임) */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a
              href="/blog"
              className={getMenuItemClassName("/blog")}
              title="블로그"
            >
              Blog
            </a>
            <a
              href="/about"
              className={getMenuItemClassName("/about")}
              title="소개"
            >
              About
            </a>
            <a
              href="/projects"
              className={getMenuItemClassName("/projects")}
              title="프로젝트"
            >
              Projects
            </a>
            {showAdmin && (
              <a
                href="/admin"
                className={getMenuItemClassName("/admin")}
                title="관리자"
              >
                Admin
              </a>
            )}
            {showLogin && (
              <a href="/login" className={getMenuItemClassName("/login")}>
                Login
              </a>
            )}
          </div>

          {/* 모바일용 햄버거 메뉴 (md 미만에서만 보임) */}
          <div className="md:hidden">
            <IconDropdown
              title="페이지 메뉴"
              icon={<FiMoreHorizontal className="h-4 w-4" />}
              widthClass="w-40"
              parentContainerRef={navBarRef as React.RefObject<HTMLElement>}
              dropdownContent={
                <div>
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="/blog"
                        className={getMobileMenuItemClassName("/blog")}
                        title="블로그"
                      >
                        블로그
                      </a>
                    </li>
                    <li>
                      <a
                        href="/about"
                        className={getMobileMenuItemClassName("/about")}
                        title="소개"
                      >
                        소개
                      </a>
                    </li>
                    <li>
                      <a
                        href="/projects"
                        className={getMobileMenuItemClassName("/projects")}
                        title="프로젝트"
                      >
                        프로젝트
                      </a>
                    </li>
                    {showAdmin && (
                      <li>
                        <a
                          href="/admin"
                          className={getMobileMenuItemClassName("/admin")}
                          title="관리자"
                        >
                          관리자
                        </a>
                      </li>
                    )}
                    {showLogin && (
                      <li>
                        <a
                          href="/login"
                          className={getMobileMenuItemClassName("/login")}
                        >
                          로그인
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              }
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
