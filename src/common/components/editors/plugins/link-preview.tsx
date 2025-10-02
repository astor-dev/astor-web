import {
    type JsxComponentDescriptor,
    insertJsx$,
    usePublisher,
    Button,
    type JsxEditorProps
} from "@mdxeditor/editor";
import { FaLink } from "react-icons/fa";

// LinkPreview 커스텀 에디터 컴포넌트
const LinkPreviewEditor = ({ mdastNode }: JsxEditorProps) => {
  const urlAttr = mdastNode?.attributes?.find((attr: { name?: string; value?: unknown }) => attr.name === "url");
  const url = typeof urlAttr?.value === "string" ? urlAttr.value : "";

  return (
    <div className="my-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
        <FaLink className="h-4 w-4 text-blue-500" />
        LinkPreview
      </div>
      {url && (
        <div className="border border-gray-300 rounded p-2 bg-white">
          <div className="text-sm font-medium text-gray-700 mb-1">URL: {url}</div>
        </div>
      )}
    </div>
  );
};

// LinkPreview JSX 컴포넌트 디스크립터
export const linkPreviewComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: "LinkPreview",
    kind: "flow", // 블록 레벨 컴포넌트
    source: "~common/components/card/link-preview.astro", // import 소스
    props: [
      { name: "url", type: "string" }, // URL을 받는 prop
    ],
    hasChildren: false, // 자식 요소 없음
    Editor: LinkPreviewEditor, // 커스텀 에디터 컴포넌트
    defaultExport: true,
  },
];

// LinkPreview 삽입 버튼 컴포넌트
export const LinkPreviewButton = () => {
  const insertJsx = usePublisher(insertJsx$);

  const handleInsertLinkPreview = () => {
    const url = prompt("링크 URL을 입력하세요:");

    if (url) {
      insertJsx({
        name: "LinkPreview",
        kind: "flow",
        props: { url: url },
      });
    }
  };

  return (
    <Button
      onClick={handleInsertLinkPreview}
      title="LinkPreview 삽입"
      className="flex items-center gap-1"
    >
      <FaLink className="h-[16px] w-[16px] text-blue-500" />
    </Button>
  );
};

