import React, { useCallback } from "react";
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

const formatMarkdown = (markdownText: string) => {
  // return markdownText.replace(/\n/g, "<br/>");
  return markdownText;
};

const Editor: React.FC<EditorProps> = ({ markdown, onChange, placeholder }) => {
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null);
  const oldMarkdownRef = React.useRef(markdown); // 이전 마크다운 값을 저장하기 위한 ref
  const imageService = serviceContainer.get<ImageService>(IMAGE_SERVICE);
  const handleChange = useCallback(
    (content: string) => {
      onChange(content);
    },
    [onChange, markdown],
  );

  return (
    <MDXEditor
      markdown={formatMarkdown(markdown)}
      onChange={handleChange}
      ref={mdxEditorRef}
      placeholder={placeholder}
      contentEditableClassName="prose max-w-none min-h-[500px] p-4"
      trim={false}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        imagePlugin({
          imageUploadHandler: async file => {
            try {
              return await imageService.uploadImage("projects", file);
            } catch (error) {
              console.error("이미지 업로드 실패:", error);
              throw error;
            }
          },
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
          toolbarContents: () => (
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
                    fallback: () => (
                      <>
                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
