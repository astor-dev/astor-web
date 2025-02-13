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

export default defineConfig({
  site: "https://astorverse.com",
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
      remarkPlugins: [
        remarkMath,
        // [
        //   remarkCollapse,
        //   {
        //     test: "목차",
        //     summary: "목차 자세히",
        //   },
        // ],
      ],
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
