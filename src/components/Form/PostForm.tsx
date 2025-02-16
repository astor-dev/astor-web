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

interface PostFormProps {
  initialData?: Partial<{
    data: {
      author: string;
      createdAt: string;
      updatedAt: string;
      title: string;
      pinned: boolean;
      draft: boolean;
      tags: string[];
      ogImage: string;
      series?: string;
      description: string;
    };
    body: string;
  }>;
}

const PostForm: React.FC<PostFormProps> = ({ initialData }) => {
  const postsService = serviceContainer.get<PostsService>(POSTS_SERVICE);

  // 기본 날짜 형식: YYYY-MM-DD
  const getDefaultDate = () => dayjs().format("YYYY-MM-DD");

  const [formData, setFormData] = useState(() => {
    const defaultDate = getDefaultDate();
    return {
      author: initialData?.data?.author ?? "Astor",
      createdAt: initialData?.data?.createdAt ?? defaultDate,
      updatedAt: initialData?.data?.updatedAt ?? defaultDate,
      title: initialData?.data?.title ?? "",
      pinned: initialData?.data?.pinned ?? false,
      draft: initialData?.data?.draft ?? true,
      tags: initialData?.data?.tags ?? ["others"],
      ogImage: initialData?.data?.ogImage ?? "",
      series: initialData?.data?.series ?? "",
      description: initialData?.data?.description ?? "",
    };
  });

  const [markdownContent, setMarkdownContent] = useState(
    () => initialData?.body ?? "",
  );

  // 마크다운 에디터 내용 업데이트
  const handleMarkdownChange = useCallback((content: string) => {
    setMarkdownContent(prev => {
      if (prev === content) {
        return prev;
      }
      return content;
    });
  }, []);

  // 폼의 기본적인 텍스트 입력 필드 변경 핸들러
  const handleFormChange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const target = e.target as HTMLElement;
      // ogImage 및 태그 입력은 별도로 처리
      if (target.id === "ogImage" || target.id === "tags") {
        return;
      }

      const form = e.currentTarget;
      const fd = new FormData(form);

      const updatedData = {
        ...formData,
        author: fd.get("author") as string,
        createdAt: fd.get("createdAt") as string,
        updatedAt: fd.get("updatedAt") as string,
        title: fd.get("title") as string,
        series: fd.get("series") as string,
        description: fd.get("description") as string,
      };

      setFormData(updatedData);
    },
    [formData],
  );

  // 날짜 입력 필드 변경 핸들러 (작성일, 수정일)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 태그 입력: 쉼표(,)로 구분하여 배열로 저장
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tags = value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
    setFormData(prev => ({
      ...prev,
      tags,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        // 필요한 경우 여기서 추가 가공 가능
      };

      const postData = {
        frontmatter: submissionData,
        body: markdownContent,
      };

      await postsService.createPost(postData);
      window.location.href = "/admin/posts";
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
          기본 정보
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
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
          <Input
            id="series"
            name="series"
            label="시리즈 (선택)"
            defaultValue={formData.series}
          />
          <Input
            id="createdAt"
            name="createdAt"
            label="작성일"
            type="date"
            required
            defaultValue={formData.createdAt}
            onChange={handleDateChange}
          />
          <Input
            id="updatedAt"
            name="updatedAt"
            label="수정일"
            type="date"
            required
            defaultValue={formData.updatedAt}
            onChange={handleDateChange}
          />
          <TextareaInput
            id="description"
            name="description"
            label="포스트 간단 설명"
            required
            defaultValue={formData.description}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pinned"
                name="pinned"
                checked={formData.pinned}
                onChange={e =>
                  setFormData(prev => ({ ...prev, pinned: e.target.checked }))
                }
                className="focus:ring-skin-accent h-4 w-4 rounded border-skin-line text-skin-accent"
              />
              <label htmlFor="pinned" className="ml-2 text-sm text-black-base">
                상단 고정
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="draft"
                name="draft"
                checked={formData.draft}
                onChange={e =>
                  setFormData(prev => ({ ...prev, draft: e.target.checked }))
                }
                className="focus:ring-skin-accent h-4 w-4 rounded border-skin-line text-skin-accent"
              />
              <label htmlFor="draft" className="ml-2 text-sm text-black-base">
                임시 저장 (초안)
              </label>
            </div>
          </div>
          <Input
            id="tags"
            name="tags"
            label="태그 (쉼표로 구분)"
            required
            defaultValue={formData.tags.join(", ")}
            onChange={handleTagsChange}
          />
          <ImageFileInput
            id="ogImage"
            name="ogImage"
            label="OG 이미지"
            type="posts"
            required
            value={formData.ogImage}
            setValue={url =>
              setFormData(prev => ({ ...prev, ogImage: url || "" }))
            }
          />
        </div>
      </div>

      {/* 상세 내용 (마크다운) 입력 영역 */}
      <div className="rounded-lg border border-skin-line bg-white p-6">
        <Editor
          markdown={markdownContent}
          onChange={handleMarkdownChange}
          placeholder="포스트 내용을 작성해주세요..."
        />
      </div>

      {/* 폼 제출/취소 버튼 영역 */}
      <div className="flex justify-end gap-3">
        <IconButton text="취소" href="/admin/posts" variant="secondary" />
        <IconButton text="저장하기" variant="primary" type="submit" />
      </div>
    </form>
  );
};

export default PostForm;
