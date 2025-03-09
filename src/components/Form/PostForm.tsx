import React, { useState, useCallback } from "react";
import dayjs from "dayjs";
import Editor from "~components/Editor/MDXEditor";
import IconButton from "~components/Button/IconButton";
import Input from "~components/Input/Input";
import TextareaInput from "~components/Input/TextareaInput";
import ImageFileInput from "~components/Input/ImageFileInput";
import { serviceContainer } from "~modules/service.module";
import {
  POSTS_SERVICE,
  type PostsService,
} from "~modules/services/posts.service";
import CheckboxGroupInput from "~components/Input/CheckboxGroupInput";
import type { Tag } from "~types/post.type";
import AutoCompleteMultiInput from "~components/Input/AutoCompleteMultiInput";
import AutoCompleteInput from "~components/Input/AutoCompleteInput";
import { generateId } from "~utils/id.utils";
import type { SeriesEntry } from "~types/series.type";

interface PostFormProps {
  series: SeriesEntry[];
  tags: Tag[];
  initialData?: Partial<{
    data: {
      id: string;
      author: string;
      title: string;
      pinned: boolean;
      draft: boolean;
      tags: string[];
      ogImage: string;
      seriesId?: string;
      description: string;
      createdAt: string; // ← 날짜
      updatedAt: string; // ← 날짜
    };
    body: string;
  }>;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, tags, series }) => {
  const postsService = serviceContainer.get<PostsService>(POSTS_SERVICE);

  // 기본 날짜 문자열(YYYY-MM-DD HH:mm:ss)
  const defaultDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [formData, setFormData] = useState(() => {
    return {
      id: initialData?.data?.id ?? generateId(),
      author: initialData?.data?.author ?? "Astor",
      title: initialData?.data?.title ?? "",
      options: {
        pinned: initialData?.data?.pinned ?? false,
        draft: initialData?.data?.draft ?? false,
      },
      tags: initialData?.data?.tags ?? [],
      ogImage: initialData?.data?.ogImage ?? "",
      seriesId: initialData?.data?.seriesId ?? "",
      description: initialData?.data?.description ?? "",
      // createdAt, updatedAt 기본값 세팅
      createdAt:
        dayjs(initialData?.data?.createdAt).format("YYYY-MM-DD HH:mm:ss") ??
        defaultDate,
      updatedAt: defaultDate,
    };
  });

  const [markdownContent, setMarkdownContent] = useState(
    () => initialData?.body ?? "",
  );

  // 마크다운 에디터 내용 업데이트: 이미 useCallback으로 최적화됨
  const handleMarkdownChange = useCallback((content: string) => {
    setMarkdownContent(prev => (prev === content ? prev : content));
  }, []);

  // 폼의 기본적인 텍스트 입력 필드 변경 핸들러
  const handleFormChange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const target = e.target as HTMLElement;

      // createdAt, updatedAt, ogImage, tags 등 특정 필드는 이 로직에 포함시키지 않음
      if (
        target.id === "ogImage" ||
        target.id === "tags" ||
        target.id === "createdAt" ||
        target.id === "updatedAt"
      ) {
        return;
      }

      const form = e.currentTarget;
      const fd = new FormData(form);
      const optionsValues = fd.getAll("options") as string[];
      const pinned = optionsValues.includes("pinned");
      const draft = optionsValues.includes("draft");

      setFormData(prev => ({
        ...prev,
        options: {
          pinned,
          draft,
        },
        author: fd.get("author") as string,
        title: fd.get("title") as string,
        seriesId: fd.get("series") as string,
        description: fd.get("description") as string,
        // createdAt, updatedAt 은 여기서 갱신하지 않음
      }));
    },
    [],
  );

  // 시리즈 초기값을 위한 상태와 로직
  const [selectedSeriesId, setSelectedSeriesId] = useState(
    initialData?.data?.seriesId || "",
  );

  // 시리즈 옵션 준비 - 이름과 ID 매핑
  const seriesOptions = series.map(s => ({
    label: s.data.name, // 화면에 표시될 시리즈 이름
    value: s.id, // 선택 시 실제 저장될 시리즈 ID
  }));

  // 초기 선택된 시리즈 이름 찾기
  const initialSeriesName = selectedSeriesId
    ? series.find(s => s.id === selectedSeriesId)?.data.name || ""
    : "";

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 필요하다면, 제출 시 updatedAt을 현재 시각으로 갱신
      // const now = dayjs().format("YYYY-MM-DD");
      // setFormData(prev => ({ ...prev, updatedAt: now }));

      const submissionData = {
        id: initialData?.data?.id ?? generateId(),
        author: formData.author,
        title: formData.title,
        seriesId: formData.seriesId,
        tags: formData.tags,
        ogImage: formData.ogImage,
        description: formData.description,
        pinned: formData.options.pinned,
        draft: formData.options.draft,
        createdAt: formData.createdAt, // readOnly이지만 전송 포함
        updatedAt: formData.updatedAt,
      };

      const postData = {
        frontmatter: submissionData,
        body: markdownContent,
      };

      await postsService.createPost(postData);
      // ... 이후 페이지 이동 or 알림
      alert("포스트가 저장되었습니다.");
      window.location.href = "/admin/blog";
    } catch (error) {
      if (error instanceof Error) {
        alert(`포스트 저장에 실패했습니다: ${error.message}`);
      } else {
        alert("포스트 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
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
          기본 정보 (ID: {formData.id})
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <CheckboxGroupInput
              name="options"
              label="옵션"
              options={[
                { value: "pinned", label: "상단 고정" },
                { value: "draft", label: "임시 저장" },
              ]}
              required
              defaultValues={[
                formData.options.pinned ? "pinned" : "",
                formData.options.draft ? "draft" : "",
              ]}
            />
          </div>

          {/* createdAt (읽기 전용 + date) */}
          <Input
            id="createdAt"
            name="createdAt"
            label="작성일"
            type="datetime-local"
            required
            defaultValue={formData.createdAt}
            disabled
          />

          {/* updatedAt (읽기 전용 + date) */}
          <Input
            id="updatedAt"
            name="updatedAt"
            label="수정일"
            type="datetime-local"
            required
            defaultValue={formData.updatedAt}
            disabled
          />

          <Input
            id="title"
            name="title"
            label="제목"
            required
            defaultValue={formData.title}
          />

          <Input
            id="author"
            name="author"
            label="작성자"
            required
            defaultValue={formData.author}
          />

          {/* 시리즈 자동완성 - 수정된 부분 */}
          <AutoCompleteInput
            id="series"
            name="series"
            label="시리즈 (선택)"
            defaultValue={selectedSeriesId}
            defaultLabel={initialSeriesName}
            options={seriesOptions}
            onValueChange={value => {
              setSelectedSeriesId(value);
              setFormData(prev => ({ ...prev, seriesId: value }));
            }}
          />

          {/* 태그 다중 자동완성 */}
          <AutoCompleteMultiInput
            id="tags"
            name="tags"
            label="태그"
            required
            placeholder="태그를 입력하고 Enter나 ','로 확정"
            options={tags?.map(t => ({ label: t.tag, value: t.tag })) ?? []}
            defaultValue={formData.tags}
            onTagsChange={newTags => {
              setFormData(prev => ({ ...prev, tags: newTags }));
            }}
          />

          <div className="lg:col-span-2">
            <ImageFileInput
              id="ogImage"
              name="ogImage"
              label="OG 이미지"
              type="posts"
              required
              value={formData.ogImage}
              setValue={url => {
                setFormData(prev => ({ ...prev, ogImage: url || "" }));
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <TextareaInput
              id="description"
              name="description"
              label="간단 설명"
              required
              defaultValue={formData.description}
            />
          </div>
        </div>
      </div>

      {/* 상세 내용 (마크다운) 입력 영역 */}
      <div className="items-center justify-center rounded-lg border border-skin-line bg-white">
        <Editor markdown={markdownContent} onChange={handleMarkdownChange} />
      </div>

      <div className="flex justify-end gap-3">
        <IconButton text="취소" href="/admin/blog" variant="secondary" />
        <IconButton text="저장하기" variant="primary" type="submit" />
      </div>
    </form>
  );
};

export default PostForm;
