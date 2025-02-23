import React, { useState, useCallback } from "react";
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
import Input from "~components/Input/Input";
import SelectInput from "~components/Input/SelectInput";
import TextareaInput from "~components/Input/TextareaInput";
import CheckboxGroupInput from "~components/Input/CheckboxGroupInput";
import ImageFileInput from "~components/Input/ImageFileInput";
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

  // 폼 필드 변경 시 즉시 반영되는 "기본 정보"
  const [formData, setFormData] = useState<ProjectEntry["data"]>(() => {
    const initialDate = getInitialDate();
    return {
      projectName: initialData?.data?.projectName ?? "",
      projectType: initialData?.data?.projectType ?? ProjectTypeEnum.options[0],
      imageUrl: initialData?.data?.imageUrl ?? "",
      siteUrl: initialData?.data?.siteUrl ?? "",
      companyName: initialData?.data?.companyName ?? "",
      startedAt: initialData?.data?.startedAt ?? initialDate,
      endedAt: initialData?.data?.endedAt ?? initialDate,
      roles: initialData?.data?.roles ?? [],
      shortDescription: initialData?.data?.shortDescription ?? "",
      stackIds: initialData?.data?.stackIds ?? [],
    };
  });

  const [markdownContent, setMarkdownContent] = useState(() => {
    return initialData?.body ?? "";
  });

  // MDXEditor의 변경 이벤트 최적화를 위해 handleMarkdownChange에서 함수형 업데이트 사용 + 의존성 최소화
  const handleMarkdownChange = useCallback((content: string) => {
    setMarkdownContent(prev => (prev === content ? prev : content));
  }, []);

  // 폼 내용 변경 시마다 호출 (이미지, 무기한 체크박스, 스택 체크박스 영역은 제외)
  const handleFormChange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const target = e.target as HTMLElement;
      if (
        target.id === "imageUrl" ||
        target.id === "infiniteEndDate" ||
        target.closest("#stackIds")
      ) {
        return;
      }
      const form = e.currentTarget;
      const fd = new FormData(form);
      setFormData(prev => ({
        ...prev,
        projectName: fd.get("projectName") as string,
        projectType: fd.get("projectType") as ProjectType,
        imageUrl: prev.imageUrl, // 기존 값을 유지
        siteUrl: (fd.get("siteUrl") as string) || "",
        companyName: fd.get("companyName") as string,
        startedAt: fd.get("startedAt") as string,
        endedAt: fd.get("endedAt") as string,
        roles: fd.getAll("roles") as ProjectRole[],
        shortDescription: fd.get("shortDescription") as string,
        stackIds: prev.stackIds, // 변경 없음
      }));
    },
    [],
  );

  // 스택 ID 변경 핸들러 (함수형 업데이트 사용)
  const handleStackIdsChange = useCallback((values: string[]) => {
    setFormData(prev => ({
      ...prev,
      stackIds: values.map(id => Number(id)),
    }));
  }, []);

  // 폼 제출 처리
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const submissionData = {
          ...formData,
          siteUrl: formData.siteUrl || "",
          endedAt: formData.endedAt || "",
          stackIds: formData.stackIds || [],
        };
        const projectData = {
          frontmatter: submissionData,
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
    [formData, markdownContent, projectsService],
  );

  // 월 선택 시 날짜를 해당 월의 첫날로 설정하는 핸들러
  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      try {
        const date = dayjs(value + "-01")
          .hour(12)
          .format("YYYY-MM");
        setFormData(prev => ({
          ...prev,
          [name]: date,
        }));
      } catch (error) {
        console.error("날짜 변환 오류:", error);
      }
    },
    [],
  );

  // 종료일 무기한 설정 핸들러
  const handleEndDateInfinite = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        endedAt: e.target.checked ? "" : dayjs().hour(12).format("YYYY-MM"),
      }));
    },
    [],
  );

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
            <Input
              id="projectName"
              name="projectName"
              label="프로젝트명"
              required
              defaultValue={formData.projectName}
            />
          </div>

          <Input
            id="companyName"
            name="companyName"
            label="회사명"
            required
            defaultValue={formData.companyName}
          />

          <SelectInput
            id="projectType"
            name="projectType"
            label="프로젝트 유형"
            options={PROJECT_TYPES}
            required
            defaultValue={formData.projectType}
          />

          <div className="lg:col-span-2">
            <ImageFileInput
              id="imageUrl"
              name="imageUrl"
              label="이미지"
              type="projects"
              required
              value={formData.imageUrl}
              setValue={url => {
                setFormData(prev => ({
                  ...prev,
                  imageUrl: url || "",
                }));
              }}
            />
            <p className="mt-2 text-sm text-skin-accent">
              이미지는 4:3 비율을 권장드립니다.
            </p>
          </div>

          <div className="lg:col-span-2">
            <Input
              id="siteUrl"
              name="siteUrl"
              label="사이트 URL"
              type="url"
              required={false}
              defaultValue={formData.siteUrl}
              pattern="^$|https?:\/\/.+"
              title="URL을 입력하거나 비워두세요"
            />
            <p className="mt-2 text-sm text-skin-accent">
              사이트가 없는 경우 비워두세요.
            </p>
          </div>

          <Input
            id="startedAt"
            name="startedAt"
            label="시작일"
            type="month"
            required
            defaultValue={formatDateToYearMonth(formData.startedAt)}
            onChange={handleMonthChange}
            max={dayjs().format("YYYY-MM")}
          />

          <div className="space-y-2">
            <Input
              id="endedAt"
              name="endedAt"
              label="종료일"
              type="month"
              required={!formData.endedAt}
              defaultValue={formatDateToYearMonth(formData.endedAt)}
              onChange={handleMonthChange}
              min={formatDateToYearMonth(formData.startedAt)}
              max={dayjs().format("YYYY-MM")}
              disabled={!formData.endedAt}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="infiniteEndDate"
                checked={!formData.endedAt}
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
          <div className="lg:col-span-2">
            <CheckboxGroupInput
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

          <TextareaInput
            id="shortDescription"
            name="shortDescription"
            label="간단 설명"
            required
            defaultValue={formData.shortDescription}
          />

          <div className="lg:col-span-2">
            <CheckboxGroupInput
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
              defaultValues={formData.stackIds.map(id => id.toString())}
              enableSearch={true}
              itemsPerPage={9}
              onChange={handleStackIdsChange}
            />
          </div>
        </div>
      </div>

      {/* 상세 설명(마크다운) 입력 영역 */}
      <div className="items-center rounded-lg border border-skin-line bg-white">
        <Editor
          markdown={markdownContent}
          onChange={handleMarkdownChange}
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
