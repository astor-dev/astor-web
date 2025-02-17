import React, { useCallback, useMemo, useRef } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  imagePlugin,
  linkPlugin,
  tablePlugin,
  InsertTable,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  codeBlockPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  InsertCodeBlock,
  codeMirrorPlugin,
  type MDXEditorMethods,
  InsertThematicBreak,
} from "@mdxeditor/editor";
import "~styles/editor.css";
import { IMAGE_SERVICE, ImageService } from "~modules/services/image.service";
import { serviceContainer } from "~modules/service.module";

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

// Debounce 처리를 위한 커스텀 훅
const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number,
) => {
  const timer = useRef<number | undefined>(null);
  return useCallback(
    (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
};

const formatMarkdown = (markdownText: string) => {
  // return markdownText.replace(/\n/g, "<br/>");
  return markdownText;
};

const Editor: React.FC<EditorProps> = ({ markdown, onChange, placeholder }) => {
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  const oldMarkdownRef = useRef(markdown); // 이전 마크다운 값을 저장하기 위한 ref
  const imageService = serviceContainer.get<ImageService>(IMAGE_SERVICE);

  // 이미지 업로드 핸들러 메모이제이션
  const imageUploadHandler = useCallback(
    async (file: File) => {
      try {
        return await imageService.uploadImage("projects", file);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        throw error;
      }
    },
    [imageService],
  );

  // Debounce 적용된 onChange 콜백
  const debouncedOnChange = useDebouncedCallback((content: string) => {
    onChange(content);
  }, 300);

  // 툴바의 렌더링 함수 메모이제이션
  const renderToolbarContents = useCallback(
    () => (
      <DiffSourceToggleWrapper>
        <UndoRedo />
        <BoldItalicUnderlineToggles />
        <BlockTypeSelect />
        <CreateLink />
        <InsertThematicBreak />
        <InsertImage />
        <InsertTable />
        <ConditionalContents
          options={[
            {
              when: editor => editor?.editorType === "codeblock",
              contents: () => <ChangeCodeMirrorLanguage />,
            },
            {
              fallback: () => <InsertCodeBlock />,
            },
          ]}
        />
      </DiffSourceToggleWrapper>
    ),
    [],
  );

  // 플러그인 배열 메모이제이션
  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      imagePlugin({
        imageUploadHandler,
        imageAutocompleteSuggestions: [],
      }),
      linkPlugin(),
      tablePlugin(),
      diffSourcePlugin({
        diffMarkdown: oldMarkdownRef.current,
        viewMode: "rich-text",
      }),
      codeBlockPlugin({ defaultCodeBlockLanguage: "ts" }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          ts: "TypeScript",
          js: "JavaScript",
          java: "Java",
          tsx: "TypeScript React",
          astro: "Astro",
          css: "CSS",
          html: "HTML",
          json: "JSON",
        },
      }),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarContents: renderToolbarContents,
      }),
    ],
    [imageUploadHandler, renderToolbarContents],
  );

  return (
    <MDXEditor
      markdown={formatMarkdown(markdown)}
      onChange={debouncedOnChange}
      ref={mdxEditorRef}
      placeholder={placeholder}
      contentEditableClassName="prose prose-sm max-w-none min-h-[500px] p-4 md:prose lg:prose-lg"
      trim={false}
      plugins={plugins}
    />
  );
};

export default React.memo(Editor);
