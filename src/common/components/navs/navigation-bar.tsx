import { useState, useEffect, useRef, type MouseEvent } from "react";
import { FiArrowLeft, FiLogIn, FiSettings } from "react-icons/fi";

// Constants
const BREAKPOINT_MD = 768;
const HERO_HEIGHT_MOBILE = 450;
const HERO_HEIGHT_DESKTOP = 500;
const BLOG_MAIN_HEIGHT = 1;
const isBlogNoHeroPage = (pathname: string): boolean => {
  return pathname === "/" || /^\/(pages|tags|series)(\/|$)/.test(pathname);
};

const isProjectNoHeroPage = (pathname: string): boolean => {
  return pathname === "/projects" || pathname === "/projects/";
};

const isNoHeroPage = (pathname: string): boolean => {
  // posts/* 제외한 모든 블로그 페이지 + project 메인 페이지 (/projects)
  return isBlogNoHeroPage(pathname) || isProjectNoHeroPage(pathname);
};

const isPostPage = (pathname: string): boolean => {
  return pathname.startsWith("/posts/");
};

const isAdminPage = (pathname: string): boolean => {
  return pathname.includes("/admin");
};

const isAboutPage = (pathname: string): boolean => {
  return pathname === "/about" || pathname === "/about/";
};

// 히어로가 없는 페이지는 제목 헤더(data-nav-anchor)를 지나면 네브바를 고정한다
const getNoHeroHeight = (): number => {
  const anchor = document.querySelector("[data-nav-anchor]");
  if (!anchor) {
    return BLOG_MAIN_HEIGHT;
  }
  return anchor.getBoundingClientRect().bottom + window.scrollY;
};

const getHeroHeight = (pathname: string): number => {
  if (isNoHeroPage(pathname)) {
    return getNoHeroHeight();
  }
  return window.innerWidth >= BREAKPOINT_MD
    ? HERO_HEIGHT_DESKTOP
    : HERO_HEIGHT_MOBILE;
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
  // 주요 섹션(히어로·제목 헤더)을 지난 뒤 네브바 가운데에 보여줄 타이틀
  title?: string;
}

const NavigationBar = ({ pathname, title }: NavBarProps) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isTextWhite, setIsTextWhite] = useState(true);
  const [isInHero, setIsInHero] = useState(true);
  const [shouldHideNavBar, setShouldHideNavBar] = useState(true);
  const navBarRef = useRef<HTMLDivElement>(null);

  const iconHoverClassName = isTextWhite
    ? "hover:text-skin-base"
    : "hover:text-skin-accent/80";
  const iconClassName = `h-[18px] w-[18px] md:h-5 md:w-5 ${iconHoverClassName}`;

  // 사이트 안에서 넘어온 경우에만 이전 페이지로, 외부 유입이면 href(/)로 이동
  const handleBackClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (document.referrer.startsWith(window.location.origin)) {
      event.preventDefault();
      window.history.back();
    }
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

  // 스크롤 위치와 URL에 따른 네브바 상태 관리
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const newIsInHero = calculateIsInHero(pathname, window.scrollY);
          setIsInHero(newIsInHero);
          setIsTextWhite(!isNoHeroPage(pathname) && newIsInHero);
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
      className={`left-1/2 z-50 w-full -translate-x-1/2 print:hidden ${
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
      <nav className="mx-auto grid h-14 w-full max-w-[1200px] grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-4 px-4 md:h-16 md:px-6">
        {/* 왼쪽: 글 상세에서는 뒤로가기, 그 외에는 로고 */}
        {isPostPage(pathname) ? (
          <a
            href="/"
            title="뒤로가기"
            aria-label="뒤로가기"
            className="justify-self-start"
            onClick={handleBackClick}
          >
            <FiArrowLeft className={iconClassName} />
          </a>
        ) : (
          <a
            href="/"
            title="홈"
            className="justify-self-start whitespace-nowrap font-logo text-xl md:text-2xl"
          >
            astor-dev
          </a>
        )}

        {/* 가운데: 주요 섹션을 지난 뒤에만 보이는 페이지 타이틀 */}
        <p
          className={`truncate text-center text-sm font-bold md:text-base tracking-tight text-black-accent ${
            isInHero ? "invisible" : "visible"
          }`}
          aria-hidden={isInHero}
        >
          {title}
        </p>

        {/* 오른쪽: 아이콘 메뉴 */}
        <div className="flex flex-shrink-0 items-center gap-4 justify-self-end">
          {showAdmin && (
            <a href="/admin" title="관리자" aria-label="관리자">
              <FiSettings className={iconClassName} />
            </a>
          )}
          {showLogin && (
            <a href="/login" title="로그인" aria-label="로그인">
              <FiLogIn className={iconClassName} />
            </a>
          )}
          <a
            href="/about"
            title="소개"
            className={`text-sm font-medium ${iconHoverClassName}`}
          >
            About
          </a>
        </div>
      </nav>

    </header>
  );
};

export default NavigationBar;
