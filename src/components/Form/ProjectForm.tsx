import React, { useState, useCallback, useRef } from "react";
import {
  ProjectRoleEnum,
  ProjectTypeEnum,
  type ProjectEntry,
  type ProjectRole,
  type ProjectType,
} from "~types/project.type";
import Editor from "~components/Editor/MDXEditor";
import IconButton from "~components/Button/IconButton";
import { stacks } from "~constants/stacks";
import Input, { type InputMethods } from "~components/Input/Input";
import SelectInput, {
  type SelectInputMethods,
} from "~components/Input/SelectInput";
import TextareaInput, {
  type TextareaInputMethods,
} from "~components/Input/TextareaInput";
import CheckboxGroupInput, {
  type CheckboxGroupInputMethods,
} from "~components/Input/CheckboxGroupInput";
import ImageFileInput, {
  type ImageFileInputMethods,
} from "~components/Input/ImageFileInput";
import dayjs from "dayjs";
import { serviceContainer } from "~modules/service.module";
import {
  PROJECTS_SERVICE,
  type ProjectsService,
} from "~modules/services/projects.service";

interface ProjectFormProps {
  initialData?: Partial<ProjectEntry>;
}

const PROJECT_TYPES = ProjectTypeEnum.options;
const ROLES = ProjectRoleEnum.options;

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData }) => {
  const projectsService =
    serviceContainer.get<ProjectsService>(PROJECTS_SERVICE);
  const editorRef = useRef<{ getMarkdown: () => string } | null>(null);

  // 각 입력 필드 ref 생성
  const projectNameRef = useRef<InputMethods>(null);
  const companyNameRef = useRef<InputMethods>(null);
  const projectTypeRef = useRef<SelectInputMethods>(null);
  const imageUrlRef = useRef<ImageFileInputMethods>(null);
  const siteUrlRef = useRef<InputMethods>(null);
  const startedAtRef = useRef<InputMethods>(null);
  const endedAtRef = useRef<InputMethods>(null);
  const rolesRef = useRef<CheckboxGroupInputMethods>(null);
  const shortDescriptionRef = useRef<TextareaInputMethods>(null);
  const stackIdsRef = useRef<CheckboxGroupInputMethods>(null);

  // 종료일 무기한 체크박스 상태만 관리 (UI 업데이트 필요)
  const [isInfiniteEndDate, setIsInfiniteEndDate] = useState(
    () => !initialData?.data?.endedAt,
  );

  // 초기 마크다운 내용 저장
  const initialMarkdown = initialData?.body ?? "";

  // 날짜를 YYYY-MM 형식으로 안전하게 변환하는 헬퍼 함수
  const formatDateToYearMonth = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = dayjs(dateString);
      return date.isValid()
        ? date.format("YYYY-MM")
        : dayjs().format("YYYY-MM");
    } catch {
      return dayjs().format("YYYY-MM");
    }
  };

  // 초기 상태 설정을 위한 함수
  const getInitialDate = () => {
    return dayjs().startOf("month").hour(12).format("YYYY-MM");
  };

  // 현재 폼 데이터 수집 함수
  const getFormData = useCallback((): ProjectEntry["data"] => {
    return {
      projectName: projectNameRef.current?.getValue() || "",
      projectType:
        (projectTypeRef.current?.getValue() as ProjectType) ||
        ProjectTypeEnum.options[0],
      imageUrl: imageUrlRef.current?.getValue() || "",
      siteUrl: siteUrlRef.current?.getValue() || "",
      companyName: companyNameRef.current?.getValue() || "",
      startedAt: startedAtRef.current?.getValue() || getInitialDate(),
      endedAt: isInfiniteEndDate
        ? ""
        : endedAtRef.current?.getValue() || getInitialDate(),
      roles: (rolesRef.current?.getValues() as ProjectRole[]) || [],
      shortDescription: shortDescriptionRef.current?.getValue() || "",
      stackIds: (stackIdsRef.current?.getValues() || []).map(id => Number(id)),
    };
  }, [isInfiniteEndDate]);

  // 에디터 ref 설정 콜백
  const handleEditorRef = useCallback(
    (editorInstance: { getMarkdown: () => string } | null) => {
      editorRef.current = editorInstance;
    },
    [],
  );

  // 폼 제출 처리
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        // 현재 폼 데이터 수집
        const formData = getFormData();

        // 에디터에서 현재 마크다운 콘텐츠 가져오기
        const markdownContent = editorRef.current?.getMarkdown() || "";

        const projectData = {
          frontmatter: formData,
          body: markdownContent,
        };
        await projectsService.createProject(projectData);
        // 성공 시 리다이렉트
        alert("프로젝트가 저장되었습니다.");
        window.location.href = "/admin/projects";
      } catch (error) {
        if (error instanceof Error) {
          alert(`프로젝트 저장에 실패했습니다: ${error.message}`);
        } else {
          alert("프로젝트 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    },
    [getFormData, projectsService],
  );

  // 종료일 무기한 설정 핸들러
  const handleEndDateInfinite = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsInfiniteEndDate(e.target.checked);
    },
    [],
  );

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-skin-line bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-black-accent">
          기본 정보
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="lg:col-span-2">
            <Input
              ref={projectNameRef}
              id="projectName"
              name="projectName"
              label="프로젝트명"
              required
              defaultValue={initialData?.data?.projectName ?? ""}
            />
          </div>

          <Input
            ref={companyNameRef}
            id="companyName"
            name="companyName"
            label="회사명"
            required
            defaultValue={initialData?.data?.companyName ?? ""}
          />

          <SelectInput
            ref={projectTypeRef}
            id="projectType"
            name="projectType"
            label="프로젝트 유형"
            options={PROJECT_TYPES}
            required
            defaultValue={
              initialData?.data?.projectType ?? ProjectTypeEnum.options[0]
            }
          />

          <div className="md:col-span-2">
            <ImageFileInput
              ref={imageUrlRef}
              id="imageUrl"
              name="imageUrl"
              label="이미지"
              type="projects"
              required
              value={initialData?.data?.imageUrl ?? ""}
            />
            <p className="mt-2 text-sm text-skin-accent">
              이미지는 4:3 비율을 권장드립니다.
            </p>
          </div>

          <div className="md:col-span-2">
            <Input
              ref={siteUrlRef}
              id="siteUrl"
              name="siteUrl"
              label="사이트 URL"
              type="url"
              required={false}
              defaultValue={initialData?.data?.siteUrl ?? ""}
              pattern="^$|https?:\/\/.+"
              title="URL을 입력하거나 비워두세요"
            />
            <p className="mt-2 text-sm text-skin-accent">
              사이트가 없는 경우 비워두세요.
            </p>
          </div>

          <Input
            ref={startedAtRef}
            id="startedAt"
            name="startedAt"
            label="시작일"
            type="month"
            required
            defaultValue={formatDateToYearMonth(
              initialData?.data?.startedAt ?? getInitialDate(),
            )}
            max={dayjs().format("YYYY-MM")}
          />

          <div className="space-y-2">
            <Input
              ref={endedAtRef}
              id="endedAt"
              name="endedAt"
              label="종료일"
              type="month"
              required={!isInfiniteEndDate}
              defaultValue={formatDateToYearMonth(
                initialData?.data?.endedAt ?? getInitialDate(),
              )}
              min={formatDateToYearMonth(
                initialData?.data?.startedAt ?? getInitialDate(),
              )}
              max={dayjs().format("YYYY-MM")}
              disabled={isInfiniteEndDate}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="infiniteEndDate"
                checked={isInfiniteEndDate}
                onChange={handleEndDateInfinite}
                className="focus:ring-skin-accent h-4 w-4 rounded border-skin-line text-skin-accent"
              />
              <label
                htmlFor="infiniteEndDate"
                className="text-sm text-black-base"
              >
                진행 중 (종료일 미정)
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <CheckboxGroupInput
              ref={rolesRef}
              name="roles"
              label="역할"
              options={ROLES.map(role => ({
                value: role,
                label: role,
              }))}
              required
              defaultValues={initialData?.data?.roles ?? []}
            />
          </div>

          <TextareaInput
            ref={shortDescriptionRef}
            id="shortDescription"
            name="shortDescription"
            label="간단 설명"
            required
            defaultValue={initialData?.data?.shortDescription ?? ""}
          />

          <div className="md:col-span-2">
            <CheckboxGroupInput
              ref={stackIdsRef}
              name="stackIds"
              id="stackIds"
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
                  category: stack.stackType,
                }))}
              required
              defaultValues={(initialData?.data?.stackIds ?? []).map(id =>
                id.toString(),
              )}
              enableSearch={true}
              itemsPerPage={9}
            />
          </div>
        </div>
      </div>

      {/* 상세 설명(마크다운) 입력 영역 */}
      <div className="editor-container rounded-lg border border-skin-line bg-white">
        <Editor
          markdown={initialMarkdown}
          onChange={() => {}} // 빈 콜백 - 제출 시에만 값을 읽기 위함
          ref={handleEditorRef}
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
