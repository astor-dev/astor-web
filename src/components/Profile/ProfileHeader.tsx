import React, { useRef } from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import { IoIosSchool, IoIosCalendar, IoMdPin } from "react-icons/io";

interface ProfileHeaderProps {
  name: string;
  realName: string;
  role: string;
  imageSrc: string;
  info?: {
    birth?: string;
    education?: {
      school: string;
      majors: string[];
      year?: string;
    };
    location?: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  realName,
  role,
  imageSrc,
  info,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(headerRef, {
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <header
      ref={headerRef}
      className={`relative mb-24 min-h-[300px] w-full transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className="flex w-full flex-col items-center justify-center">
        {/* 이미지 컨테이너 */}
        <div className="relative">
          {/* 배경 장식 요소 */}
          <div className="absolute -inset-4">
            <div className="animate-spin-slow bg-gradient-conic from-skin-accent/30 h-full w-full rounded-full to-transparent blur-2xl" />
          </div>

          {/* 프로필 이미지 */}
          <div className="relative aspect-square overflow-hidden rounded-full border-4 border-white shadow-xl">
            <ImageWithSkeleton
              src={imageSrc}
              alt={name}
              className="h-32 w-32 transform object-cover transition-transform duration-700 hover:scale-110 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
              onLoadComplete={() => {}}
            />
          </div>
        </div>

        {/* 텍스트 컨테이너 */}
        <div className="mt-8 text-center">
          {/* 이름 영역 */}
          <div className="relative space-y-1">
            {/* 닉네임 */}
            <h1 className="text-black-accent relative z-10 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {name}
            </h1>
            {/* 실명 */}
            <p className="text-black-muted relative text-base font-medium sm:text-lg">
              {realName}
            </p>
            {/* 장식적 요소 */}
            <div className="absolute -inset-x-4 -inset-y-2 -z-10 h-full w-[calc(100%+2rem)] rounded-lg bg-white/50 backdrop-blur-sm" />
          </div>

          {/* 역할 */}
          <div className="relative mt-6">
            <span className="text-black-base relative inline-block px-4 py-1.5 text-lg sm:text-xl lg:text-2xl">
              {role}
              {/* 밑줄 장식 */}
              <span className="via-skin-accent/50 absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent to-transparent" />
            </span>
          </div>

          {/* 추가 정보 */}
          {info && (
            <div className="text-black-muted mt-8 flex flex-wrap justify-center gap-4 text-sm sm:gap-6">
              {info.birth && (
                <div className="flex items-center gap-1">
                  <IoIosCalendar />
                  <span>{info.birth}</span>
                </div>
              )}
              {info.education && (
                <div className="flex items-center gap-1">
                  <IoIosSchool />
                  <div className="flex flex-col items-start">
                    <span>{info.education.school}</span>
                    <span className="text-black-muted text-xs">
                      {info.education.majors.join(" · ")}
                      {info.education.year && ` (${info.education.year})`}
                    </span>
                  </div>
                </div>
              )}
              {info.location && (
                <div className="flex items-center gap-1">
                  <IoMdPin />
                  <span>{info.location}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 배경 장식 요소들 */}
        <div className="from-skin-accent/5 pointer-events-none absolute -left-32 top-0 -z-10 h-[200px] w-[500px] -rotate-12 bg-gradient-to-l to-transparent blur-3xl" />
        <div className="from-skin-accent/5 pointer-events-none absolute -right-32 bottom-0 -z-10 h-[200px] w-[500px] rotate-12 bg-gradient-to-r to-transparent blur-3xl" />
      </div>
    </header>
  );
};

export default ProfileHeader;
