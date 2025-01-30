import React from "react";
import {
  ProjectRoleEnum,
  ProjectTypeEnum,
  type ProjectEntry,
} from "~types/project.type";

interface ProjectFormProps {
  initialData?: Partial<ProjectEntry>;
  onSubmit?: (data: FormData) => void;
}

const PROJECT_TYPES = ProjectTypeEnum.options;
const ROLES = ProjectRoleEnum.options;

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit }) => {
  return (
    <form
      className="space-y-8"
      onSubmit={e => {
        e.preventDefault();
        if (onSubmit) {
          const formData = new FormData(e.currentTarget);
          onSubmit(formData);
        }
      }}
    >
      <div className="rounded-lg border border-skin-line bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-black-accent">
          기본 정보
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor="projectName"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              프로젝트명 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              required
              defaultValue={initialData?.data?.projectName}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            />
          </div>

          <div>
            <label
              htmlFor="projectType"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              프로젝트 유형 <span className="text-danger">*</span>
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              defaultValue={initialData?.data?.projectType}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            >
              <option value="">선택해주세요</option>
              {PROJECT_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              이미지 URL <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              required
              defaultValue={initialData?.data?.imageUrl}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            />
          </div>

          <div>
            <label
              htmlFor="siteUrl"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              사이트 URL <span className="text-danger">*</span>
            </label>
            <input
              type="url"
              id="siteUrl"
              name="siteUrl"
              required
              defaultValue={initialData?.data?.siteUrl}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            />
          </div>

          <div>
            <label
              htmlFor="companyName"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              회사명 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              defaultValue={initialData?.data?.companyName}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            />
          </div>

          <div>
            <label
              htmlFor="startedAt"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              시작일 <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              id="startedAt"
              name="startedAt"
              required
              defaultValue={initialData?.data?.startedAt}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            />
          </div>

          <div>
            <label
              htmlFor="endedAt"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              종료일 <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              id="endedAt"
              name="endedAt"
              required
              defaultValue={initialData?.data?.endedAt}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black-accent">
              역할 <span className="text-danger">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {ROLES.map(role => (
                <label key={role} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="roles"
                    value={role}
                    defaultChecked={initialData?.data?.roles?.includes(role)}
                    className="focus:ring-skin-accent rounded border-skin-line text-skin-accent"
                  />
                  <span className="text-sm text-black-base">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="shortDescription"
              className="mb-2 block text-sm font-medium text-black-accent"
            >
              간단 설명 <span className="text-danger">*</span>
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              required
              defaultValue={initialData?.data?.shortDescription}
              rows={3}
              className="focus:ring-skin-accent w-full rounded-lg border border-skin-line px-4 py-2 focus:border-skin-accent focus:outline-none focus:ring-1"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProjectForm;
