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
import type { Series, Tag } from "~types/post.type";
import AutoCompleteMultiInput from "~components/Input/AutoCompleteMultiInput";
import AutoCompleteInput from "~components/Input/AutoCompleteInput";

interface PostFormProps {
  series: Series[];
  tags: Tag[];
  initialData?: Partial<{
    data: {
      author: string;
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

const PostForm: React.FC<PostFormProps> = ({ initialData, tags, series }) => {
  const postsService = serviceContainer.get<PostsService>(POSTS_SERVICE);

  const [formData, setFormData] = useState(() => {
    return {
      author: initialData?.data?.author ?? "Astor",
      title: initialData?.data?.title ?? "",
      options: {
        pinned: initialData?.data?.pinned ?? false,
        draft: initialData?.data?.draft ?? false,
      },
      tags: initialData?.data?.tags ?? [],
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
      const optionsValues = fd.getAll("options") as string[];
      const pinned = optionsValues.includes("pinned");
      const draft = optionsValues.includes("draft");

      const updatedData = {
        ...formData,
        options: {
          pinned,
          draft,
        },
        author: fd.get("author") as string,
        title: fd.get("title") as string,
        series: fd.get("series") as string,
        description: fd.get("description") as string,
      };

      setFormData(updatedData);
    },
    [formData],
  );

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submissionData = {
        author: formData.author,
        title: formData.title,
        series: formData.series,
        tags: formData.tags,
        ogImage: formData.ogImage,
        description: formData.description,
        pinned: formData.options.pinned,
        draft: formData.options.draft,
      };

      const postData = {
        frontmatter: submissionData,
        body: markdownContent,
      };
      console.log(postData);
      await postsService.createPost({ data: postData });
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
          <div className="lg:col-span-2">
            <CheckboxGroupInput
              name="options"
              label="옵션"
              options={[
                {
                  value: "pinned",
                  label: "상단 고정",
                },
                {
                  value: "draft",
                  label: "임시 저장",
                },
              ]}
              required
              defaultValues={[
                formData.options.pinned ? "pinned" : "",
                formData.options.draft ? "draft" : "",
              ]}
            />
          </div>
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
          <AutoCompleteInput
            id="series"
            name="series"
            label="시리즈 (선택)"
            defaultValue={formData.series}
            allOptions={series?.map(series => series.series) ?? []}
            onValueChange={value => {
              setFormData(prev => ({ ...prev, series: value }));
            }}
          />
          <AutoCompleteMultiInput
            id="tags"
            name="tags"
            label="태그"
            required
            placeholder="태그를 입력하고 Enter나 ','로 확정"
            allTags={tags?.map(tag => tag.tag) ?? []} // 태그 후보 목록
            defaultValue={formData.tags} // 기존에 선택된 태그들
            onTagsChange={newTags => {
              // 상위 formData를 업데이트
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
              setValue={url =>
                setFormData(prev => ({ ...prev, ogImage: url || "" }))
              }
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
