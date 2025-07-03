import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  InsertImage,
  imagePlugin,
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
  directivesPlugin,
  linkPlugin,
  linkDialogPlugin,
} from "@mdxeditor/editor";
import "~styles/editor.css";
import { IMAGE_SERVICE, ImageService } from "~modules/services/image.service";
import { serviceContainer } from "~modules/service.module";
import {
  iframePlugin,
  IframeDirectiveDescriptor,
  IframeButton,
} from "~components/Editor/plugins/iframe";

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

// 외부에서 접근할 수 있는 메서드 타입 정의
export interface EditorRefMethods {
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
}

const formatMarkdown = (markdownText: string) => {
  // return markdownText.replace(/\n/g, "<br/>");
  return markdownText;
};

const Editor = forwardRef<EditorRefMethods, EditorProps>(
  ({ markdown, onChange, placeholder }, ref) => {
    const mdxEditorRef = useRef<MDXEditorMethods>(null);
    const latestMarkdownRef = useRef(markdown); // 최신 마크다운 내용을 ref로 관리
    const imageService = serviceContainer.get<ImageService>(IMAGE_SERVICE);

    // 내부적으로만 변경 사항 추적 (props로 받은 onChange는 성능 최적화를 위해 실제로는 호출하지 않음)
    const handleChange = useCallback((content: string) => {
      latestMarkdownRef.current = content;

      // 상위 컴포넌트에서 실시간 업데이트가 필요한 경우에만 아래 라인 활성화
      // onChange(content);
    }, []);

    // 외부에서 접근 가능한 메서드 제공
    useImperativeHandle(
      ref,
      () => ({
        getMarkdown: () => {
          if (mdxEditorRef.current) {
            // MDXEditor의 현재 마크다운 내용 반환
            return mdxEditorRef.current.getMarkdown();
          }
          // 에디터 참조가 없을 경우 마지막으로 알고 있는 마크다운 반환
          return latestMarkdownRef.current;
        },
        setMarkdown: (markdown: string) => {
          if (mdxEditorRef.current) {
            try {
              console.log(
                "에디터 마크다운 설정:",
                markdown.slice(0, 50) + "...",
              );
              mdxEditorRef.current.setMarkdown(markdown);
              // 내부 상태도 함께 업데이트
              latestMarkdownRef.current = markdown;
              // onChange 호출하여 상위 컴포넌트 상태 업데이트
              handleChange(markdown);
            } catch (error) {
              console.error("마크다운 설정 중 오류:", error);
            }
          } else {
            console.warn("에디터 ref가 없어 마크다운을 설정할 수 없습니다.");
            // ref는 없지만 내부 상태는 업데이트
            latestMarkdownRef.current = markdown;
          }
        },
      }),
      [handleChange],
    );

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

    // 툴바의 렌더링 함수 메모이제이션
    const renderToolbarContents = useCallback(
      () => (
        <DiffSourceToggleWrapper>
          <UndoRedo />
          <BoldItalicUnderlineToggles />
          <BlockTypeSelect />
          <InsertThematicBreak />
          <InsertImage />
          <InsertTable />
          <IframeButton />
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
        directivesPlugin({
          directiveDescriptors: [IframeDirectiveDescriptor],
        }),
        imagePlugin({
          imageUploadHandler,
          imageAutocompleteSuggestions: [],
        }),
        tablePlugin(),
        iframePlugin(),
        diffSourcePlugin({
          diffMarkdown: markdown, // 초기 마크다운만 비교 기준으로 사용
          viewMode: "rich-text",
        }),
        codeBlockPlugin({ defaultCodeBlockLanguage: "ts" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            ts: "TypeScript",
            js: "JavaScript",
            java: "Java",
            kotlin: "Kotlin",
            tsx: "TypeScript React",
            astro: "Astro",
            css: "CSS",
            html: "HTML",
            json: "JSON",
            markdown: "Markdown",
            plaintext: "Plaintext",
            python: "Python",
            yaml: "YAML",
            bash: "Bash",
            sql: "SQL",
            math: "Math",
          },
          autoLoadLanguageSupport: true,
        }),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        toolbarPlugin({
          toolbarClassName:
            "mdx-editor-toolbar sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm shadow-sm",
          toolbarContents: renderToolbarContents,
        }),
      ],
      [imageUploadHandler, renderToolbarContents, markdown],
    );

    return (
      <MDXEditor
        markdown={formatMarkdown(markdown)}
        onChange={handleChange}
        ref={mdxEditorRef}
        placeholder={placeholder}
        contentEditableClassName="prose prose-sm min-h-[500px] md:prose"
        trim={false}
        plugins={plugins}
        toMarkdownOptions={{
          bullet: "-",
        }}
      />
    );
  },
);

export default React.memo(Editor);
