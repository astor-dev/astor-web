import type { CollectionEntry } from "astro:content";
import React from "react";
import { FaPen, FaTrash, FaExternalLinkAlt } from "react-icons/fa";

interface ProjectTableProps {
  projects: CollectionEntry<"projects">[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-skin-line bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-skin-line">
          <thead className="bg-skin-fill">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-black-muted">
                프로젝트명
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black-muted">
                유형
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black-muted">
                회사
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black-muted">
                기간
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black-muted">
                역할
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-black-muted">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-skin-line">
            {projects.map(project => (
              <tr key={project.id} className="hover:bg-skin-fill/50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black-accent">
                      {project.data.projectName}
                    </span>
                    {project.data.siteUrl && (
                      <a
                        href={project.data.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-skin-accent hover:text-skin-accent/80"
                      >
                        <FaExternalLinkAlt className="text-sm" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-black-base">
                  {project.data.projectType}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-black-base">
                  {project.data.companyName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-black-base">
                  {project.data.startedAt} ~ {project.data.endedAt}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.data.roles.map(role => (
                      <span
                        key={role}
                        className="inline-flex items-center rounded-full bg-skin-accent/10 px-2 py-0.5 text-xs font-medium text-skin-accent"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/projects/${project.id}/edit`}
                      className="inline-flex items-center rounded p-1 text-black-muted hover:text-skin-accent"
                      title="수정"
                    >
                      <FaPen className="text-sm" />
                    </a>
                    <button
                      className="hover:text-danger inline-flex items-center rounded p-1 text-black-muted"
                      title="삭제"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
