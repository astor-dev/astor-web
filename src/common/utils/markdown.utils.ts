import { remark } from "remark";
import strip from "strip-markdown";

// URL patterns to be stripped from markdown content
const STRIP_URL_PATTERNS: RegExp[] = [
  /^import\s+LinkPreview\s+from\s+['"]~common\/components\/card\/link-preview\.astro['"];?$/,
  // Add more URL patterns here as needed
];

export const filterLinesOutsideCodeBlock = (
  content: string,
  patternList: readonly RegExp[]
): string => {
  const lines = content.split('\n');
  let isInCodeBlock = false;
  const filteredLines: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      isInCodeBlock = !isInCodeBlock;
      filteredLines.push(line);
      continue;
    }
    
    if (!isInCodeBlock) {
      const shouldFilterLine = patternList.some(pattern => pattern.test(line));
      if (shouldFilterLine) {
        continue;
      }
    }
    
    filteredLines.push(line);
  }

  return filteredLines.join('\n');
};

export const stripMdx = async (content: string): Promise<string> => {
  const cleanedContent = filterLinesOutsideCodeBlock(content, STRIP_URL_PATTERNS);
  const result = await remark().use(strip).process(cleanedContent);
  return result.toString();
};
