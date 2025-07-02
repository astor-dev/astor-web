import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiTag, FiLayers, FiMoreHorizontal } from "react-icons/fi";
import SearchModal from "~components/Modal/SearchModal";
import type { PostTitleAndId, Tag, SeriesAndCount } from "~types/post.type";
import IconDropdown from "~components/Dropdown/IconDropdown";

// Constants
const BREAKPOINT_MD = 768;
const HERO_HEIGHT_MOBILE = 450;
const HERO_HEIGHT_DESKTOP = 500;
const BLOG_MAIN_HEIGHT = 1;

const isNoHeroPage = (pathname: string): boolean => {
  // blog/posts/* || blog/series/* 제외한 모든 블로그 페이지 + project 메인 페이지 (/projects)
  return (
    pathname.match(/^\/blog(\/(?!posts\/|series\/).*)?$/) !== null ||
    pathname === "/projects"
  );
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
  tags: Tag[];
  series: SeriesAndCount[];
  posts: PostTitleAndId[];
}

const NavBar = ({ pathname, tags, series, posts }: NavBarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isTextWhite, setIsTextWhite] = useState(true);
  const navBarRef = useRef<HTMLDivElement>(null);

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
    <>
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
        {/* container 클래스로 좌우 여백을 지정 (모바일 대응) */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-1 sm:px-6 sm:py-2 lg:px-8">
          {/* 왼쪽 아이콘 그룹: 태그, 시리즈 */}
          <div className="flex items-center sm:space-x-4">
            <IconDropdown
              title="태그"
              icon={<FiTag className="h-4 w-4 sm:h-5 sm:w-5" />}
              widthClass="w-72"
              parentContainerRef={navBarRef as React.RefObject<HTMLElement>}
              dropdownContent={
                <div>
                  <h5 className="mb-2 text-base font-semibold text-black-base sm:text-lg">
                    태그 모음
                  </h5>
                  <ul className="grid grid-cols-2 gap-1 sm:gap-2">
                    {tags
                      .sort((a, b) => b.count - a.count)
                      .map(tag => (
                        <li key={tag.tag}>
                          <a
                            href={`/blog/tags/${encodeURIComponent(tag.tag)}`}
                            className="cursor-pointer text-sm text-black-base hover:underline sm:text-base"
                          >
                            #{tag.tag} ({tag.count})
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              }
            />

            <IconDropdown
              title="시리즈"
              icon={<FiLayers className="h-4 w-4 sm:h-5 sm:w-5" />}
              widthClass="w-60"
              parentContainerRef={navBarRef as React.RefObject<HTMLElement>}
              dropdownContent={
                <div>
                  <h5 className="mb-2 text-base font-semibold text-black-base sm:text-lg">
                    연재 시리즈
                  </h5>
                  <ul className="space-y-1">
                    {series.map(item => (
                      <li key={item.series.data.id}>
                        <a
                          href={`/blog/series/${encodeURIComponent(item.series.data.id)}`}
                          className="cursor-pointer text-sm text-black-base hover:underline sm:text-base"
                        >
                          {item.series.data.name} ({item.count})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
          </div>

          {/* 중앙 로고 */}
          <div className="flex-shrink-0">
            <a
              href="/"
              title="홈"
              className={`font-logo text-lg sm:text-lg md:text-xl`}
            >
              astor-dev
            </a>
          </div>

          {/* 오른쪽 아이콘 그룹: 페이지 메뉴, 검색 */}
          <div className="flex items-center sm:space-x-4">
            <IconDropdown
              title="페이지 메뉴"
              icon={<FiMoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />}
              widthClass="w-40"
              parentContainerRef={navBarRef as React.RefObject<HTMLElement>}
              dropdownContent={
                <div>
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="/blog"
                        className="block text-sm text-black-base hover:underline sm:text-base"
                        title="블로그"
                      >
                        블로그
                      </a>
                    </li>
                    <li>
                      <a
                        href="/about"
                        className="block text-sm text-black-base hover:underline sm:text-base"
                        title="소개"
                      >
                        소개
                      </a>
                    </li>
                    <li>
                      <a
                        href="/projects"
                        className="block text-sm text-black-base hover:underline sm:text-base"
                        title="프로젝트"
                      >
                        프로젝트
                      </a>
                    </li>
                    {showAdmin && (
                      <li>
                        <a
                          href="/admin"
                          className="block text-sm text-black-base hover:underline sm:text-base"
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
                          className="block text-sm text-black-base hover:underline sm:text-base"
                        >
                          로그인
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              }
            />

            <div className="flex h-10 w-10 items-center justify-center sm:h-10 sm:w-10">
              <button
                title="검색"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-full w-full items-center justify-center hover:text-skin-accent"
              >
                <FiSearch className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 검색 모달 */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tags={tags}
        series={series}
        posts={posts}
      />
    </>
  );
};

export default NavBar;
