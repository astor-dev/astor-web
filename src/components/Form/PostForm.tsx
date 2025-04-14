import React, { useState, useCallback, useRef, useEffect } from "react";
import dayjs from "dayjs";
import Editor, { type EditorRefMethods } from "~components/Editor/MDXEditor";
import IconButton from "~components/Button/IconButton";
import Input, { type InputMethods } from "~components/Input/Input";
import ImageFileInput, {
  type ImageFileInputMethods,
} from "~components/Input/ImageFileInput";
import { serviceContainer } from "~modules/service.module";
import {
  POSTS_SERVICE,
  type PostsService,
} from "~modules/services/posts.service";
import CheckboxGroupInput, {
  type CheckboxGroupInputMethods,
} from "~components/Input/CheckboxGroupInput";
import type { Tag } from "~types/post.type";
import AutoCompleteMultiInput, {
  type AutoCompleteMultiInputMethods,
} from "~components/Input/AutoCompleteMultiInput";
import AutoCompleteInput, {
  type AutoCompleteInputMethods,
} from "~components/Input/AutoCompleteInput";
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
      createdAt: string; // ← 날짜
      updatedAt: string; // ← 날짜
    };
    body: string;
  }>;
}

// 로컬 스토리지 키 접두사
const DRAFT_KEY_PREFIX = "post_draft_";

// 로컬 스토리지 키 생성 함수
const getLocalStorageKey = (postId: string) => `${DRAFT_KEY_PREFIX}${postId}`;

const PostForm: React.FC<PostFormProps> = ({ initialData, tags, series }) => {
  const postsService = serviceContainer.get<PostsService>(POSTS_SERVICE);

  // 에디터 ref 추가
  const editorRef = useRef<EditorRefMethods | null>(null);

  // 각 입력 필드 ref 생성
  const titleRef = useRef<InputMethods>(null);
  const authorRef = useRef<InputMethods>(null);
  const createdAtRef = useRef<InputMethods>(null);
  const updatedAtRef = useRef<InputMethods>(null);
  const optionsRef = useRef<CheckboxGroupInputMethods>(null);
  const tagsRef = useRef<AutoCompleteMultiInputMethods>(null);
  const seriesRef = useRef<AutoCompleteInputMethods>(null);
  const ogImageRef = useRef<ImageFileInputMethods>(null);

  // 마지막 자동 저장 시간 표시를 위한 상태
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // 로컬 스토리지에서 임시 저장 데이터 있는지 확인 여부
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  // 임시저장 목록 표시 여부 상태
  const [showDraftList, setShowDraftList] = useState(false);

  // 저장된 모든 임시저장 데이터 목록
  const [draftsList, setDraftsList] = useState<
    { id: string; title: string; timestamp: string }[]
  >([]);

  // 현재 마크다운 내용 상태
  const [markdownContent, setMarkdownContent] = useState<string>(
    initialData?.body ?? "",
  );

  // 기본 날짜 문자열(YYYY-MM-DD HH:mm:ss)
  const defaultDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
  // postId를 useState로 관리하여 리렌더링에도 유지되도록 수정
  const [postId] = useState(() => initialData?.data?.id ?? generateId());

  // 로컬 스토리지에서 모든 임시저장 데이터 가져오기
  const getAllDrafts = useCallback(() => {
    const drafts: { id: string; title: string; timestamp: string }[] = [];
    // 7일 이상 지난 임시저장 항목 삭제
    const now = dayjs();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(DRAFT_KEY_PREFIX)) {
        try {
          const draftData = JSON.parse(localStorage.getItem(key) || "");
          const draftId = key.replace(DRAFT_KEY_PREFIX, "");

          // 7일 이상 지난 데이터는 자동 삭제
          if (
            draftData.timestamp &&
            now.diff(dayjs(draftData.timestamp), "day") > 7
          ) {
            localStorage.removeItem(key);
            continue;
          }

          if (draftData.formData && draftData.timestamp) {
            drafts.push({
              id: draftId,
              title: draftData.formData.title || "제목 없음",
              timestamp: draftData.timestamp,
            });
          }

          if (key === getLocalStorageKey(postId)) {
            setHasLocalDraft(true);
          }
        } catch (error) {
          console.error("임시저장 데이터 파싱 오류:", error);
        }
      }
    }

    // 최신순 정렬
    return drafts.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, []);

  // 현재 폼 데이터 수집 함수
  const getFormData = useCallback(() => {
    const options = optionsRef.current?.getValues() || [];

    return {
      id: postId,
      author: authorRef.current?.getValue() || "Astor",
      title: titleRef.current?.getValue() || "",
      pinned: options.includes("pinned"),
      draft: options.includes("draft"),
      tags: tagsRef.current?.getValues() || [],
      ogImage: ogImageRef.current?.getValue() || "",
      seriesId: seriesRef.current?.getValue() || "",
      createdAt: createdAtRef.current?.getValue() || defaultDate,
      updatedAt: updatedAtRef.current?.getValue() || defaultDate,
    };
  }, [postId, defaultDate]);

  // 로컬 스토리지에 폼 데이터와 마크다운 저장
  const saveToLocalStorage = useCallback(() => {
    try {
      // 현재 에디터 내용 가져오기
      const currentMarkdown =
        editorRef.current?.getMarkdown() ?? markdownContent;

      // 현재 폼 데이터 가져오기
      const formData = getFormData();

      // 내용이 비어있으면 저장하지 않음
      if (!currentMarkdown.trim() && !formData.title.trim()) {
        return;
      }

      const dataToSave = {
        formData,
        markdownContent: currentMarkdown,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        getLocalStorageKey(postId),
        JSON.stringify(dataToSave),
      );
      setLastSaved(dayjs().format("HH:mm:ss"));
      setHasLocalDraft(true);

      console.log("임시저장 완료:", formData);
    } catch (error) {
      console.error("임시 저장 실패:", error);
    }
  }, [getFormData, markdownContent, postId]);

  // 초기 데이터 로드 - setTimeout으로 렌더링 이후에 처리
  useEffect(() => {
    // 모든 임시저장 데이터 목록 가져오기
    setDraftsList(getAllDrafts());

    if (initialData?.data) {
      setTimeout(() => {
        setFormValues(initialData.data);
      }, 100);
    }
  }, [getAllDrafts, initialData?.data]);

  // 자동 저장 함수
  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에 저장된 현재 포스트 임시저장 데이터 체크
    const localStorageKey = getLocalStorageKey(postId);
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      setHasLocalDraft(true);
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.timestamp) {
          setLastSaved(dayjs(parsedData.timestamp).format("HH:mm:ss"));
        }
      } catch (error) {
        console.error("임시저장 데이터 파싱 오류:", error);
      }
    }

    // 1분마다 자동 저장
    const saveInterval = setInterval(() => {
      saveToLocalStorage();
    }, 60000);

    return () => {
      clearInterval(saveInterval as unknown as number);
    };
  }, [saveToLocalStorage, postId]);

  // 특정 값으로 폼 데이터 설정
  const setFormValues = useCallback(
    (data: any) => {
      if (!data) return;

      console.log("폼 데이터 설정:", data);

      try {
        // 각 ref를 통해 값 설정 (setTimeout으로 비동기 처리)
        setTimeout(() => {
          if (titleRef.current && data.title !== undefined) {
            titleRef.current.setValue(data.title);
          }

          if (authorRef.current && data.author !== undefined) {
            authorRef.current.setValue(data.author);
          }

          if (optionsRef.current) {
            const options: string[] = [];
            if (data.pinned) options.push("pinned");
            if (data.draft) options.push("draft");
            console.log("옵션 설정:", options, "원본 데이터:", {
              pinned: data.pinned,
              draft: data.draft,
            });
            optionsRef.current.setValues(options);
          }

          if (tagsRef.current && data.tags !== undefined) {
            tagsRef.current.setValues(data.tags || []);
          }

          if (seriesRef.current && data.seriesId !== undefined) {
            seriesRef.current.setValue(data.seriesId || "");
          }

          if (ogImageRef.current && data.ogImage !== undefined) {
            ogImageRef.current.setValue(data.ogImage || "");
          }

          if (createdAtRef.current && data.createdAt !== undefined) {
            createdAtRef.current.setValue(data.createdAt);
          }

          if (updatedAtRef.current) {
            updatedAtRef.current.setValue(defaultDate); // 항상 현재 시간으로
          }
        }, 0);
      } catch (error) {
        console.error("폼 데이터 설정 중 오류:", error);
      }
    },
    [defaultDate],
  );

  // 특정 임시저장 데이터 불러오기
  const loadDraft = useCallback((draftId: string) => {
    const localStorageKey = getLocalStorageKey(draftId);
    const savedData = localStorage.getItem(localStorageKey);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("parsedData", parsedData);

        // 데이터 유효성 검사 추가
        if (!parsedData.formData || !parsedData.markdownContent) {
          alert("유효하지 않은 임시저장 데이터입니다.");
          return false;
        }

        console.log("임시저장 데이터 불러오기:", parsedData);

        // 임시저장 데이터로 폼 업데이트 (비동기로 처리)
        setTimeout(() => {
          setFormValues(parsedData.formData);

          // 마크다운 에디터 내용 설정
          if (editorRef.current && parsedData.markdownContent) {
            editorRef.current.setMarkdown?.(parsedData.markdownContent);
          }
          setMarkdownContent(parsedData.markdownContent);

          setLastSaved(dayjs(parsedData.timestamp).format("HH:mm:ss"));

          // 목록 닫기
          setShowDraftList(false);
        }, 0);

        return true;
      } catch (error) {
        console.error("임시 저장 데이터 로드 오류:", error);
        alert("임시 저장 데이터를 불러오는 중 오류가 발생했습니다.");
        return false;
      }
    }
    return false;
  }, []);

  // 특정 임시저장 데이터 삭제
  const deleteDraft = useCallback(
    (draftId: string, event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation();
      }

      const localStorageKey = getLocalStorageKey(draftId);

      if (window.confirm("정말 이 임시저장 데이터를 삭제하시겠습니까?")) {
        localStorage.removeItem(localStorageKey);

        // 목록 갱신
        setDraftsList(getAllDrafts());

        // 현재 포스트의 임시저장이었으면 상태 업데이트
        if (draftId === postId) {
          setHasLocalDraft(false);
          setLastSaved(null);
        }
      }
    },
    [getAllDrafts, postId],
  );

  // 에디터 ref 설정 콜백
  const handleEditorRef = useCallback(
    (editorInstance: EditorRefMethods | null) => {
      editorRef.current = editorInstance;
    },
    [],
  );

  // 에디터 내용 변경 핸들러
  const handleEditorChange = useCallback((content: string) => {
    setMarkdownContent(content);
  }, []);

  // 임시 저장 데이터 삭제 함수
  const clearLocalDraft = useCallback(() => {
    const localStorageKey = getLocalStorageKey(postId);
    localStorage.removeItem(localStorageKey);
    setHasLocalDraft(false);
    setLastSaved(null);

    // 목록 갱신
    setDraftsList(getAllDrafts());
  }, [postId, getAllDrafts]);

  // 수동으로 임시 저장하는 함수
  const handleManualSave = useCallback(() => {
    saveToLocalStorage();
    alert("현재 내용이 임시 저장되었습니다.");

    // 목록 갱신
    setDraftsList(getAllDrafts());
  }, [saveToLocalStorage, getAllDrafts]);

  // 임시저장 목록 토글
  const toggleDraftList = useCallback(() => {
    if (!showDraftList) {
      // 목록을 열 때 최신 데이터로 갱신
      setDraftsList(getAllDrafts());
    }
    setShowDraftList(!showDraftList);
  }, [showDraftList, getAllDrafts]);

  // 시리즈 옵션 준비 - 이름과 ID 매핑
  const seriesOptions = series.map(s => ({
    label: s.data.name, // 화면에 표시될 시리즈 이름
    value: s.id, // 선택 시 실제 저장될 시리즈 ID
  }));

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 현재 폼 데이터 수집
      const formData = getFormData();

      // 에디터에서 현재 마크다운 콘텐츠 가져오기
      const currentMarkdown =
        editorRef.current?.getMarkdown() ?? markdownContent;

      const postData = {
        frontmatter: formData,
        body: currentMarkdown,
      };

      await postsService.createPost(postData);

      // 성공적으로 저장된 경우 로컬 스토리지에서 임시 데이터 삭제
      clearLocalDraft();

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
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-skin-line bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black-accent">
            기본 정보 (ID: {postId})
          </h2>
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <span className="text-sm text-gray-500">
                마지막 자동 저장: {lastSaved}
              </span>
            )}
            <button
              type="button"
              onClick={handleManualSave}
              className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
            >
              임시 저장
            </button>
            <button
              type="button"
              onClick={toggleDraftList}
              className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
            >
              {showDraftList ? "목록 닫기" : "임시저장 목록"}
            </button>
            {hasLocalDraft && (
              <button
                type="button"
                onClick={clearLocalDraft}
                className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
              >
                임시 데이터 삭제
              </button>
            )}
          </div>
        </div>

        {/* 임시저장 목록 */}
        {showDraftList && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-800">임시저장 목록</h3>
            {draftsList.length === 0 ? (
              <p className="text-gray-500">저장된 임시 데이터가 없습니다.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-200 text-left">
                      <th className="pb-2">제목</th>
                      <th className="pb-2">저장 시간</th>
                      <th className="pb-2">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftsList.map(draft => (
                      <tr
                        key={draft.id}
                        className="cursor-pointer border-b border-blue-100 hover:bg-blue-100"
                        onClick={() => loadDraft(draft.id)}
                      >
                        <td className="py-2">
                          {draft.title || (
                            <span className="italic text-gray-500">
                              제목 없음
                            </span>
                          )}
                          {draft.id === postId && (
                            <span className="ml-2 rounded bg-green-100 px-1 py-0.5 text-xs text-green-800">
                              현재
                            </span>
                          )}
                        </td>
                        <td className="py-2">
                          {dayjs(draft.timestamp).format("YYYY-MM-DD HH:mm")}
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={e => deleteDraft(draft.id, e)}
                            className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <CheckboxGroupInput
              ref={optionsRef}
              name="options"
              label="옵션"
              options={[
                { value: "pinned", label: "상단 고정" },
                { value: "draft", label: "임시 저장" },
              ]}
              required
              defaultValues={
                [
                  initialData?.data?.pinned ? "pinned" : undefined,
                  initialData?.data?.draft ? "draft" : undefined,
                ].filter(Boolean) as string[]
              }
            />
          </div>

          {/* createdAt (읽기 전용 + date) */}
          <Input
            ref={createdAtRef}
            id="createdAt"
            name="createdAt"
            label="작성일"
            type="datetime-local"
            required
            defaultValue={initialData?.data?.createdAt ?? defaultDate}
            disabled
          />

          {/* updatedAt (읽기 전용 + date) */}
          <Input
            ref={updatedAtRef}
            id="updatedAt"
            name="updatedAt"
            label="수정일"
            type="datetime-local"
            required
            defaultValue={defaultDate}
            disabled
          />

          <Input
            ref={titleRef}
            id="title"
            name="title"
            label="제목"
            required
            defaultValue={initialData?.data?.title ?? ""}
          />

          <Input
            ref={authorRef}
            id="author"
            name="author"
            label="작성자"
            required
            defaultValue={initialData?.data?.author ?? "Astor"}
          />

          {/* 시리즈 자동완성 */}
          <AutoCompleteInput
            ref={seriesRef}
            id="series"
            name="series"
            label="시리즈 (선택)"
            defaultValue={initialData?.data?.seriesId || ""}
            defaultLabel={
              series.find(s => s.id === initialData?.data?.seriesId)?.data
                .name || ""
            }
            options={seriesOptions}
          />

          {/* 태그 다중 자동완성 */}
          <AutoCompleteMultiInput
            ref={tagsRef}
            id="tags"
            name="tags"
            label="태그"
            required
            placeholder="태그를 입력하고 Enter나 ','로 확정"
            options={tags?.map(t => ({ label: t.tag, value: t.tag })) ?? []}
            defaultValue={initialData?.data?.tags ?? []}
          />

          <div className="lg:col-span-2">
            <ImageFileInput
              ref={ogImageRef}
              id="ogImage"
              name="ogImage"
              label="OG 이미지"
              type="posts"
              required
              value={initialData?.data?.ogImage ?? ""}
            />
          </div>
        </div>
      </div>

      {/* 상세 내용 (마크다운) 입력 영역 */}
      <div className="items-center justify-center rounded-lg border border-skin-line bg-white">
        <Editor
          markdown={markdownContent}
          onChange={handleEditorChange}
          ref={handleEditorRef}
        />
      </div>

      <div className="flex justify-end gap-3">
        <IconButton text="취소" href="/admin/blog" variant="secondary" />
        <IconButton text="저장하기" variant="primary" type="submit" />
      </div>
    </form>
  );
};

export default PostForm;
