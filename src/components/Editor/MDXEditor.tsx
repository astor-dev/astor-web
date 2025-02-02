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
  linkDialogPlugin,
  tablePlugin,
  InsertTable,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  codeBlockPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  InsertCodeBlock,
  codeMirrorPlugin,
} from "@mdxeditor/editor";
import "~styles/editor.css";
import { ImageService } from "~services/image.service";

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}
const Editor: React.FC<EditorProps> = ({ markdown, onChange, placeholder }) => {
  // 초기 마크다운 내용을 저장
  const [initialMarkdown] = React.useState(markdown);
  const olderMarkdown = initialMarkdown;

  const handleChange = useCallback(
    (content: string) => {
      onChange(content);
    },
    [onChange],
  );

  return (
    <MDXEditor
      markdown={markdown}
      onChange={handleChange}
      placeholder={placeholder}
      contentEditableClassName="prose max-w-none min-h-[500px] p-4"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        imagePlugin({
          imageUploadHandler: async file => {
            try {
              return await ImageService.uploadImage("projects", file);
            } catch (error) {
              console.error("이미지 업로드 실패:", error);
              throw error;
            }
          },
          imageAutocompleteSuggestions: [],
        }),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        diffSourcePlugin({
          diffMarkdown: olderMarkdown,
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
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <UndoRedo />

              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <CreateLink />
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
