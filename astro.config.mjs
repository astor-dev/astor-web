// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { imagetools } from "vite-imagetools";
import viteImagemin from "@vheemstra/vite-plugin-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminWebp from "imagemin-webp";
import imageminPngquant from "imagemin-pngquant";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import rehypeUnwrapList from "./src/common/utils/rehype.utils";
import rehypeKatex from "rehype-katex";
import { visit } from "unist-util-visit";

// YouTube URL에서 비디오 ID 추출
// @ts-ignore
function extractYouTubeVideoId(url) {
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
// @ts-ignore
function getYouTubeEmbedUrl(url) {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url; // 일반 URL은 그대로 반환
}

// 커스텀 iframe 디렉티브 처리 플러그인
function remarkIframeDirective() {
  // @ts-ignore
  return tree => {
    visit(tree, node => {
      // 디렉티브 노드 확인
      if (
        node.type === "leafDirective" ||
        node.type === "containerDirective" ||
        node.type === "textDirective"
      ) {
        // iframe 디렉티브만 처리
        if (node.name !== "iframe") return;

        const data = node.data || (node.data = {});
        const attrs = node.attributes || {};

        // 입력된 URL이 YouTube URL일 경우 변환
        const embedUrl = getYouTubeEmbedUrl(attrs.src || "");

        // iframe HTML 생성
        data.hName = "iframe";
        data.hProperties = {
          src: embedUrl, // 변환된 URL 사용
          frameBorder: "0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: true,
          style: "aspect-ratio: 16/9; width: 100%;",
        };
      }
    });
  };
}

export default defineConfig({
  site: "https://astor-dev.com",
  output: "static",
  devToolbar: {
    enabled: true,
  },
  build: {
    assets: "assets",
  },
  integrations: [
    mdx({
      gfm: true,
      remarkPlugins: [remarkMath, remarkDirective, remarkIframeDirective],
      rehypePlugins: [rehypeUnwrapList, rehypeKatex],
      shikiConfig: {
        theme: "dracula",
        wrap: true,
      },
    }),
    sitemap(),
    react(),
    tailwind(),
  ],
  vite: {
    plugins: [
      imagetools(),
      viteImagemin({
        plugins: {
          jpg: imageminMozjpeg({ quality: 80 }),
          png: imageminPngquant({ quality: [80, 90] }),
          webp: imageminWebp({ quality: 75 }),
        },
        makeWebp: {
          plugins: {
            jpg: imageminWebp(),
            png: imageminWebp(),
          },
        },
      }),
    ],
  },
});
