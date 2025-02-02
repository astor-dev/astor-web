import React, { useRef, type ReactNode } from "react";
import type { ProjectEntry } from "~types/project.type";
import { useIntersectionObserver } from "~hooks/UseIntersectionObserver/UseIntersectionObserver";
import ImageWithSkeleton from "~components/Skeleton/ImageWithSkeleton";
import IconButton from "~components/Button/IconButton";
import StackGrid from "~components/Stack/StackGrid";

interface ProjectDetailContentProps {
  project: ProjectEntry;
  isAdmin: boolean;
  period: string;
  relatedProjects: Record<number, ProjectEntry[]>;
  children: ReactNode;
}

const ProjectDetailContent: React.FC<ProjectDetailContentProps> = ({
  project,
  isAdmin,
  period,
  relatedProjects,
  children,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLElement>(null);

  const isHeaderVisible = useIntersectionObserver(headerRef);
  const isContentVisible = useIntersectionObserver(contentRef);
  const isStackVisible = useIntersectionObserver(stackRef);
  const isDescriptionVisible = useIntersectionObserver(descriptionRef);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 헤더 섹션 */}
      <div
        ref={headerRef}
        className={`mb-8 flex transform-gpu items-center justify-between transition-all duration-700 ${
          isHeaderVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm font-medium text-skin-accent">
              {project.data.projectType === "Company-project"
                ? "회사 프로젝트"
                : "사이드 프로젝트"}
            </span>
            <h1 className="text-3xl font-bold text-black-accent">
              {project.data.projectName}
            </h1>
          </div>
        </div>
        {isAdmin && (
          <IconButton
            icon="FaPen"
            text="프로젝트 수정"
            href={`/admin/projects/detail/${project.id}/edit`}
          />
        )}
      </div>

      {/* 프로젝트 상세 내용 */}
      <div className="py-8 sm:py-12 lg:py-16">
        <header
          ref={contentRef}
          className={`mb-6 transform-gpu transition-all duration-700 sm:mb-8 lg:mb-12 ${
            isContentVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0"
          }`}
        >
          <div className="relative">
            <ImageWithSkeleton
              src={project.data.imageUrl}
              alt={project.data.projectName}
              className="aspect-4/3 w-full rounded-lg object-cover shadow-md"
            />
            <div className="absolute inset-0" />
          </div>

          <div className="mt-8">
            {/* 프로젝트 메타 정보 */}
            <div className="bg-skin-card mb-6 grid grid-cols-1 gap-4 rounded-lg p-6 shadow-sm sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-black-muted">소속</h3>
                <p className="mt-1 text-lg font-semibold text-black-accent">
                  {project.data.companyName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-black-muted">기간</h3>
                <p className="mt-1 text-lg font-semibold text-black-accent">
                  {period}
                </p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-black-muted">
                  주요 역할
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.data.roles.map((role, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full bg-skin-accent/10 px-3 py-1 text-sm font-medium text-skin-accent"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 프로젝트 요약 및 링크 */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-lg leading-relaxed text-black-base">
                {project.data.shortDescription}
              </p>
              <div className="flex shrink-0 flex-col items-end gap-3">
                <IconButton
                  icon="FiExternalLink"
                  text="사이트 방문"
                  href={project.data.siteUrl}
                  target="_blank"
                  variant={project.data.siteUrl ? "primary" : "muted"}
                  disabled={!project.data.siteUrl}
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-12">
          {/* 기술 스택 섹션 */}
          <section
            ref={stackRef}
            className={`transform-gpu transition-all duration-700 ${
              isStackVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <h2 className="mb-6 text-2xl font-bold text-black-accent">
              사용 기술
            </h2>
            <StackGrid
              stackIds={project.data.stackIds}
              relatedProjects={relatedProjects}
            />
          </section>

          {/* 프로젝트 설명 */}
          <section
            ref={descriptionRef}
            className={`prose prose-lg max-w-none transform-gpu transition-all duration-700 ${
              isDescriptionVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            {children}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailContent;
