import React, { useState, useCallback } from "react";
import {
  ProjectRoleEnum,
  ProjectTypeEnum,
  type ProjectEntry,
  type ProjectRole,
  type ProjectType,
} from "~types/project.type";
import { ProjectsService } from "~services/projects.service";
import MDXEditor from "~components/Editor/MDXEditor";
import IconButton from "~components/Button/IconButton";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormCheckboxGroup from "./FormCheckboxGroup";
import FormTextarea from "./FormTextarea";
import type { AstroGlobal } from "astro";
import { stacks } from "~constants/stacks";

interface ProjectFormProps {
  initialData?: Partial<ProjectEntry>;
}

const PROJECT_TYPES = ProjectTypeEnum.options;
const ROLES = ProjectRoleEnum.options;

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData }) => {
  // 폼 필드 변경 시 즉시 반영되는 "기본 정보"
  const [formData, setFormData] = useState<ProjectEntry["data"]>(() => ({
    projectName: initialData?.data?.projectName ?? "",
    projectType: initialData?.data?.projectType ?? ProjectTypeEnum.options[0],
    imageUrl: initialData?.data?.imageUrl ?? "",
    siteUrl: initialData?.data?.siteUrl ?? "",
    companyName: initialData?.data?.companyName ?? "",
    startedAt: initialData?.data?.startedAt ?? new Date().toISOString(),
    endedAt: initialData?.data?.endedAt ?? new Date().toISOString(),
    roles: initialData?.data?.roles ?? [],
    shortDescription: initialData?.data?.shortDescription ?? "",
    stackIds: initialData?.data?.stackIds ?? [],
  }));

  // 마크다운 에디터에서 입력한 텍스트
  const [markdownContent, setMarkdownContent] = useState<string>(
    initialData?.body ?? "",
  );

  // 폼 내용 변경 시마다 호출
  const handleFormChange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const form = e.currentTarget;
      const fd = new FormData(form);

      const updatedData: ProjectEntry["data"] = {
        projectName: fd.get("projectName") as string,
        projectType: fd.get("projectType") as ProjectType,
        imageUrl: fd.get("imageUrl") as string,
        siteUrl: fd.get("siteUrl") as string,
        companyName: fd.get("companyName") as string,
        startedAt: fd.get("startedAt") as string,
        endedAt: fd.get("endedAt") as string,
        roles: fd.getAll("roles") as ProjectRole[],
        shortDescription: fd.get("shortDescription") as string,
        stackIds: fd.getAll("stackIds").map(id => Number(id)),
      };

      setFormData(updatedData);
    },
    [],
  );

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("폼 제출 처리");
    try {
      const projectData = {
        frontmatter: formData,
        body: markdownContent,
      };

      console.log("프로젝트 최종 데이터:", projectData);

      const response = await ProjectsService.createProject(projectData);
      console.log("프로젝트 생성 성공:", response);

      window.location.href = "/admin/projects";
    } catch (error) {
      console.error("프로젝트 생성 실패:", error);
    }
  };

  return (
    <form
      className="space-y-8"
      onChange={handleFormChange}
      onSubmit={handleSubmit}
    >
      <div className="rounded-lg border border-skin-line bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-black-accent">
          기본 정보
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <FormInput
              id="projectName"
              name="projectName"
              label="프로젝트명"
              required
              defaultValue={formData.projectName}
            />
          </div>

          <FormInput
            id="companyName"
            name="companyName"
            label="회사명"
            required
            defaultValue={formData.companyName}
          />

          <FormSelect
            id="projectType"
            name="projectType"
            label="프로젝트 유형"
            options={PROJECT_TYPES}
            required
            defaultValue={formData.projectType}
          />

          <FormInput
            id="imageUrl"
            name="imageUrl"
            label="이미지 URL"
            required
            defaultValue={formData.imageUrl}
          />

          <FormInput
            id="siteUrl"
            name="siteUrl"
            label="사이트 URL"
            type="url"
            required
            defaultValue={formData.siteUrl}
          />

          <FormInput
            id="startedAt"
            name="startedAt"
            label="시작일"
            type="date"
            required
            defaultValue={
              new Date(formData.startedAt).toISOString().split("T")[0]
            }
          />

          <FormInput
            id="endedAt"
            name="endedAt"
            label="종료일"
            type="date"
            required
            defaultValue={
              new Date(formData.endedAt).toISOString().split("T")[0]
            }
          />
          <div className="lg:col-span-2">
            <FormCheckboxGroup
              name="roles"
              label="역할"
              options={ROLES.map(role => ({
                value: role,
                label: role,
              }))}
              required
              defaultValues={formData.roles}
            />
          </div>

          <FormTextarea
            id="shortDescription"
            name="shortDescription"
            label="간단 설명"
            required
            defaultValue={formData.shortDescription}
          />

          <div className="lg:col-span-2">
            <FormCheckboxGroup
              name="stackIds"
              label="사용 기술"
              options={stacks
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(stack => ({
                  value: stack.id.toString(),
                  label: stack.name,
                  icon: {
                    Icon: stack.icon,
                    color: stack.color,
                  },
                  // description: stack.description,
                  category: stack.stackType,
                }))}
              required
              defaultValues={formData.stackIds.map(id => id.toString())}
              enableSearch={true}
              itemsPerPage={9}
            />
          </div>
        </div>
      </div>

      {/* 상세 설명(마크다운) 입력 영역 */}
      <div className="rounded-lg border border-skin-line bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-black-accent">
          상세 설명
        </h2>
        <MDXEditor
          markdown={markdownContent}
          onChange={setMarkdownContent}
          placeholder="프로젝트에 대해 자세히 설명해주세요..."
        />
      </div>

      {/* 폼 제출/취소 버튼 영역 */}
      <div className="flex justify-end gap-3">
        <IconButton text="취소" href="/admin/projects" variant="secondary" />
        <IconButton text="저장하기" variant="primary" type="submit" />
      </div>
    </form>
  );
};

export default ProjectForm;
