import { visit } from "unist-util-visit";

export default function rehypeUnwrapList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, "element", node => {
      if (node.tagName === "li" && Array.isArray(node.children)) {
        const newChildren = [];
        for (const child of node.children) {
          if (child.tagName === "p" && Array.isArray(child.children)) {
            // p 태그의 자식들을 새로운 배열에 추가합니다.
            newChildren.push(...child.children);
          } else {
            // 다른 노드는 그대로 추가합니다.
            newChildren.push(child);
          }
        }
        // 최종 결과를 li 노드의 자식으로 재할당합니다.
        node.children = newChildren;
      }
    });
  };
}
