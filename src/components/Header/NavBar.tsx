import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiTag,
  FiLayers,
  FiMoreHorizontal,
  FiUser,
} from "react-icons/fi";
import SearchModal from "~components/Modal/SearchModal";
import type { TagAndCount, SeriesAndCounts } from "~utils/getPosts";
import type { PostEntry } from "~types/post.type";
import IconDropdown from "~components/Dropdown/IconDropdown";

interface NavBarProps {
  pathname: string;
  tags: TagAndCount[];
  series: SeriesAndCounts[];
  posts: PostEntry[];
  /** 스크롤에 따라 hide되는 기능 사용 여부 (기본값: true) */
  useScrollHide?: boolean;
  /** 초기 네브바 보이는 상태 여부 (기본값: true) */
  initialShowNav?: boolean;
}

function NavBar({
  pathname,
  tags,
  series,
  posts,
  useScrollHide = true,
  initialShowNav = true,
}: NavBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showNav, setShowNav] = useState(initialShowNav);

  // 모바일 여부 확인
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 로그인 쿠키 감지
  useEffect(() => {
    if (document.cookie.indexOf("isLoggedIn=true") !== -1) {
      setShowAdmin(true);
    }
  }, []);

  // 스크롤에 따라 네브바 show/hide 처리
  useEffect(() => {
    if (!useScrollHide) {
      setShowNav(true);
      return;
    }
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [useScrollHide]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full bg-skin-fill shadow-md transition-transform duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {/* 로고 */}
          <div>
            <a
              href="/"
              title="홈"
              className="text-2xl font-bold text-black-accent"
            >
              astorverse
            </a>
          </div>

          {/* 아이콘 메뉴 – 드롭다운들을 IconDropdown 컴포넌트로 분리 */}
          <div className={`flex items-center ${isMobile ? "" : "space-x-4"}`}>
            <IconDropdown
              title="태그"
              icon={<FiTag className="h-6 w-6" />}
              isMobile={isMobile}
              widthClass="w-80"
              dropdownContent={
                <div>
                  <h5 className="mb-2 text-sm font-semibold text-black-base">
                    태그 모음
                  </h5>
                  <ul className="grid grid-cols-2 gap-2">
                    {tags
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 12)
                      .map(tag => (
                        <li key={tag.tag}>
                          <a
                            href={`/blog/tags/${encodeURIComponent(tag.tag)}`}
                            className="cursor-pointer text-sm text-black-base hover:underline"
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
              icon={<FiLayers className="h-6 w-6" />}
              isMobile={isMobile}
              widthClass="w-64"
              dropdownContent={
                <div>
                  <h5 className="mb-2 text-sm font-semibold text-black-base">
                    연재 시리즈
                  </h5>
                  <ul className="space-y-1">
                    {series.map(item => (
                      <li key={item.series}>
                        <a
                          href={`/blog/series/${encodeURIComponent(item.series)}`}
                          className="cursor-pointer text-sm text-black-base hover:underline"
                        >
                          {item.series} ({item.count})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />

            <IconDropdown
              title="페이지 메뉴"
              icon={<FiMoreHorizontal className="h-6 w-6" />}
              isMobile={isMobile}
              widthClass="w-40"
              dropdownContent={
                <div>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="/blog"
                        className="block text-sm text-black-base hover:underline"
                        title="블로그"
                      >
                        블로그
                      </a>
                    </li>
                    <li>
                      <a
                        href="/about"
                        className="block text-sm text-black-base hover:underline"
                        title="소개"
                      >
                        소개
                      </a>
                    </li>
                    <li>
                      <a
                        href="/projects"
                        className="block text-sm text-black-base hover:underline"
                        title="프로젝트"
                      >
                        프로젝트
                      </a>
                    </li>
                    {showAdmin && (
                      <li>
                        <a
                          href="/admin"
                          className="block text-sm text-black-base hover:underline"
                          title="관리자"
                        >
                          관리자
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              }
            />

            {/* 검색 아이콘 (드롭다운 필요 없음) */}
            <div className="flex h-10 w-10 items-center justify-center">
              <button
                title="검색"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-full w-full items-center justify-center hover:text-skin-accent"
              >
                <FiSearch className="h-6 w-6" />
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
}

export default NavBar;
