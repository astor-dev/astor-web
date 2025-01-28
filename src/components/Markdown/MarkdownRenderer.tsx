import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
