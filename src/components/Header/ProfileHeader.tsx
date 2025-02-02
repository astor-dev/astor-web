import React, { useRef } from "react";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import { IoIosSchool, IoIosCalendar, IoMdPin } from "react-icons/io";
import { FaGithub } from "react-icons/fa";

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
    github?: string;
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
        <div className="relative w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]">
          {/* 프로필 이미지 */}
          <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-white shadow-xl">
            <ImageWithSkeleton
              src={imageSrc}
              alt={name}
              className="h-full w-full transform object-cover transition-transform duration-700 hover:scale-110"
              onLoadComplete={() => {}}
            />
          </div>
        </div>

        {/* 텍스트 컨테이너 */}
        <div className="mt-8 w-full text-center">
          {/* 이름 영역 */}
          <div className="relative mx-auto max-w-3xl space-y-1">
            {/* 닉네임 */}
            <h1 className="relative z-10 text-4xl font-bold tracking-tight text-black-accent sm:text-5xl lg:text-6xl">
              {name}
            </h1>
            {/* 실명 */}
            <p className="relative text-base font-medium text-black-muted sm:text-lg">
              {realName}
            </p>
          </div>

          {/* 역할 */}
          <div className="relative mt-6">
            <span className="relative inline-block px-4 py-1.5 text-lg text-black-base sm:text-xl lg:text-2xl">
              {role}
            </span>
          </div>

          {/* 추가 정보 */}
          {info && (
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-black-muted sm:gap-6">
              {info.birth && (
                <div className="flex items-center gap-1">
                  <IoIosCalendar />
                  <span>{info.birth}</span>
                </div>
              )}
              {info.location && (
                <div className="flex items-center gap-1">
                  <IoMdPin />
                  <span>{info.location}</span>
                </div>
              )}
              {info.github && (
                <div className="flex items-center gap-1">
                  <a
                    href={info.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-black-muted hover:text-skin-accent"
                  >
                    <FaGithub className="text-lg" />
                    <span>GitHub</span>
                  </a>
                </div>
              )}
            </div>
          )}
          {info?.education && (
            <div className="mt-4 flex justify-center text-sm text-black-muted">
              <div className="flex items-center gap-1">
                <IoIosSchool />
                <div className="flex flex-col items-start">
                  <span>{info.education.school}</span>
                  <span className="text-xs text-black-muted">
                    {info.education.majors.join(" · ")}
                    {info.education.year && ` (${info.education.year})`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
