import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ProjectEntry } from "~types/project.type";
import dayjs from "dayjs";
import { createPortal } from "react-dom";
import { stackTypeEnum, type Stack, type StackType } from "~types/stack.type";

interface RelatedProjectsProps {
  stack: Stack;
  projects: ProjectEntry[];
  onClose: () => void;
}
function isStackType(value: string): value is StackType {
  const stackTypeList: string[] = [...stackTypeEnum.options];
  return stackTypeList.includes(value);
}

const RelatedProjects: React.FC<RelatedProjectsProps> = ({
  stack,
  projects,
  onClose,
}) => {
  // 모달 내부 요소 참조 (외부 클릭 감지를 위해)
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 열림/닫힘 시 body 스크롤 제어
  useEffect(() => {
    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;

    // body 스크롤 막기
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      // 모달이 닫힐 때 원래 상태로 복원
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // 스크롤 위치 복원
      window.scrollTo(0, scrollY);
    };
  }, []);

  // ESC 키로 모달 닫기 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // 모달 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      // onClick를 남겨두면, useEffect와 중복되지만 혹시 모를 상황 대비로 사용할 수 있음.
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-h-[80dvh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-4 md:p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 md:mb-8">
          {/* Stack Header: 아이콘 + 이름 + 역할 + 닫기 버튼 */}
          <div className="mb-4 flex items-start gap-3 md:gap-4">
            <div className="bg-skin-card flex shrink-0 items-center justify-center rounded-lg text-xl text-skin-accent md:text-2xl">
              <stack.icon
                className="h-10 w-10 md:h-12 md:w-12"
                style={{ color: stack.color }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-black-accent md:text-xl">
                    {stack.name}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {stack.stackType.map(type => (
                      <span
                        key={type}
                        className="bg-skin-card inline-block rounded-full py-0.5 text-xs text-black-base"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="md:hover:bg-skin-card ml-2 shrink-0 rounded-full p-2 text-black-muted transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Stack Description */}
          <div>
            <p className="text-sm text-black-base">{stack.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-black-accent">관련 프로젝트</h3>
          {projects.length > 0 ? (
            <div className="grid gap-3 md:gap-4">
              {projects.map(project => {
                return (
                  <a
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`"border-skin-line" } group block overflow-hidden border bg-white transition-all duration-300`}
                  >
                    <div className="flex flex-col gap-3 p-3 md:gap-4 md:p-4">
                      {/* 헤더 섹션: 사진 + 이름 + 날짜 */}
                      <div className="flex items-start gap-3">
                        <div className="aspect-4/3 relative w-20 shrink-0 overflow-hidden rounded-md md:w-32">
                          <img
                            src={project.data.imageUrl}
                            alt={project.data.projectName}
                            className="h-full w-full object-cover transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2">
                            <h3 className="text-sm font-medium text-black-accent md:text-base md:group-hover:text-skin-accent">
                              {project.data.projectName}
                            </h3>
                            <p className="text-xs text-black-muted md:text-sm">
                              {project.data.companyName}
                            </p>
                          </div>
                          <div className="mb-3 md:mb-0">
                            <p className="text-xs text-black-muted md:text-sm">
                              {dayjs(project.data.startedAt).format("YYYY.MM")}{" "}
                              -{" "}
                              {project.data.endedAt
                                ? dayjs(project.data.endedAt).format("YYYY.MM")
                                : "진행중"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 바디 섹션: 역할 + 내용 */}
                      <div>
                        <div className="mb-3 flex flex-wrap gap-1 md:gap-2">
                          {project.data.roles.map(role => (
                            <span
                              key={role}
                              className={`inline-flex items-center rounded-full bg-skin-accent/10 px-2 py-0.5 text-xs text-skin-accent md:px-2.5`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                        <p className="line-clamp-2 text-xs text-black-base md:text-sm">
                          {project.data.shortDescription}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-skin-line bg-white p-4 text-center text-sm text-black-muted">
              아직 이 기술을 사용한 프로젝트가 없습니다.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default RelatedProjects;
