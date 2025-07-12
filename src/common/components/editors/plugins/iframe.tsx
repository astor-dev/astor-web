import {
  realmPlugin,
  addImportVisitor$,
  addExportVisitor$,
  addLexicalNode$,
  type DirectiveDescriptor,
  insertDirective$,
  usePublisher,
  GenericDirectiveEditor,
  DialogButton,
} from "@mdxeditor/editor";
import {
  DecoratorNode,
  type NodeKey,
  type SerializedLexicalNode,
} from "lexical";
import * as React from "react";
import { DiHtml5Multimedia } from "react-icons/di";
// 타입 정의

// YouTube URL에서 비디오 ID 추출하는 함수
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // 다양한 YouTube URL 형식 처리
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/e\/|youtube\.com\/user\/[^/]+\/[^/]+\/|youtube\.com\/[^/]+\?v=|youtube\.com\/attribution_link\?a=[^/]+\/[^/]+\/|youtube-nocookie\.com\/embed\/)([^?&/"']+)/i,
    /(?:youtube\.com\/shorts\/)([^?&/"']+)/i,
    /(?:m\.youtube\.com\/watch\?v=)([^?&/"']+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// YouTube 임베드 URL 생성
function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url; // 일반 URL은 그대로 반환
}

// 1. Lexical Node 정의
class IframeNode extends DecoratorNode<React.ReactElement> {
  __src: string;

  static getType(): string {
    return "iframe";
  }

  static clone(node: IframeNode): IframeNode {
    return new IframeNode(node.__src, node.__key);
  }

  constructor(src: string, key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    // 일반 URL인 경우 YouTube URL로 변환하여 렌더링
    const embedUrl = getYouTubeEmbedUrl(this.__src);

    return (
      <div className="my-4">
        <iframe
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  static importJSON(serializedNode: SerializedIframeNode): IframeNode {
    const { src } = serializedNode;
    return new IframeNode(src);
  }

  exportJSON(): SerializedIframeNode {
    return {
      type: "iframe",
      version: 1,
      src: this.__src,
    };
  }
}

interface SerializedIframeNode extends SerializedLexicalNode {
  type: "iframe";
  version: 1;
  src: string;
}

// 2. Markdown -> Lexical 변환기 (Import Visitor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MdastIframeVisitor: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testNode: (node: any): boolean => {
    if (!node || typeof node !== "object") return false;
    if (node.type !== "mdxJsxFlowElement") return false;

    return (
      node.name === "iframe" &&
      Array.isArray(node.attributes) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node.attributes.some((attr: any) => attr.name === "src")
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitNode: (params: any) => {
    const { lexicalParent, mdastNode, actions } = params;

    if (!mdastNode || typeof mdastNode !== "object") return;

    const srcAttr = mdastNode.attributes.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (attr: any) => attr.name === "src",
    );

    if (srcAttr && srcAttr.value) {
      const src = srcAttr.value as string;
      const node = new IframeNode(src);
      actions.appendNode(lexicalParent, node);
    }
  },
};

// 3. Lexical -> Markdown 변환기 (Export Visitor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LexicalIframeVisitor: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testLexicalNode: (lexicalNode: any): boolean => {
    return lexicalNode instanceof IframeNode;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitLexicalNode: (params: any) => {
    const { lexicalNode, actions } = params;

    if (lexicalNode instanceof IframeNode) {
      actions.appendMarkdown(
        `<iframe src="${lexicalNode.__src}" width="560" height="315" />`,
      );
    }
  },
};

// 4. Iframe 디렉티브 디스크립터 정의
export const IframeDirectiveDescriptor: DirectiveDescriptor = {
  name: "iframe",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testNode(node: any) {
    return node.name === "iframe";
  },
  attributes: ["src", "width", "height"],
  hasChildren: false,
  Editor: GenericDirectiveEditor,
};

// 5. Iframe 툴바 버튼 컴포넌트
export const IframeButton = () => {
  // 디렉티브 삽입 액션 훅
  const insertDirective = usePublisher(insertDirective$);

  return (
    <DialogButton
      tooltipTitle="Iframe 삽입"
      submitButtonTitle="삽입"
      dialogInputPlaceholder="YouTube 또는 기타 URL을 입력하세요"
      buttonContent={<DiHtml5Multimedia className="h-[24px] w-[24px]" />}
      onSubmit={url => {
        if (url) {
          insertDirective({
            name: "iframe",
            type: "leafDirective",
            attributes: {
              src: url, // 원본 URL 저장 (변환은 렌더링 시점에)
              width: "560",
              height: "315",
            },
            children: [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        } else {
          alert("유효한 URL을 입력해주세요");
        }
      }}
    />
  );
};

// 6. Plugin 정의
export const iframePlugin = realmPlugin({
  init(realm) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    realm.pub(addLexicalNode$, IframeNode as any);
    realm.pub(addImportVisitor$, MdastIframeVisitor);
    realm.pub(addExportVisitor$, LexicalIframeVisitor);
  },
});
