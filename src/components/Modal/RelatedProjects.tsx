import React from "react";
import { motion } from "framer-motion";
import type { ProjectEntry } from "~types/project.type";
import dayjs from "dayjs";
import { createPortal } from "react-dom";
import type { Stack } from "~types/stack.type";

interface RelatedProjectsProps {
  stack: Stack;
  projects: ProjectEntry[];
  onClose: () => void;
}

const RelatedProjects: React.FC<RelatedProjectsProps> = ({
  stack,
  projects,
  onClose,
}) => {
  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-8 flex items-start gap-4">
          <div className="bg-skin-card flex h-12 w-12 items-center justify-center rounded-lg text-2xl text-skin-accent">
            <stack.icon style={{ color: stack.color }} />
          </div>
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black-accent">
                  {stack.name}
                </h2>
                <span className="bg-skin-card mt-1 inline-block rounded-full px-2 py-0.5 text-xs text-black-base">
                  {stack.stackType}
                </span>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-skin-card rounded-full p-2 text-black-muted transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-black-base">{stack.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-black-accent">관련 프로젝트</h3>
          {projects.length > 0 ? (
            <div className="grid gap-4">
              {projects.map(project => {
                const isRoleRelated =
                  stack.stackType === "DevOps"
                    ? false
                    : project.data.roles.includes(stack.stackType);

                return (
                  <a
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`group block overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                      isRoleRelated
                        ? "border-skin-accent/20 bg-gradient-to-br from-skin-accent/5 to-transparent"
                        : "border-skin-line"
                    }`}
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div className="aspect-4/3 relative w-32 overflow-hidden rounded-md">
                        <img
                          src={project.data.imageUrl}
                          alt={project.data.projectName}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2">
                          <h3 className="font-medium text-black-accent group-hover:text-skin-accent">
                            {project.data.projectName}
                          </h3>
                          <p className="text-sm text-black-muted">
                            {project.data.companyName}
                          </p>
                        </div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {project.data.roles.map(role => (
                            <span
                              key={role}
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                role === stack.stackType
                                  ? "bg-skin-accent/10 text-skin-accent"
                                  : "bg-skin-card text-black-base"
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-black-muted">
                            {dayjs(project.data.startedAt).format("YYYY.MM")} -{" "}
                            {project.data.endedAt
                              ? dayjs(project.data.endedAt).format("YYYY.MM")
                              : "진행중"}
                          </p>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-black-base">
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
