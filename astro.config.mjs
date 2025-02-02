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

export default defineConfig({
  site: "https://astorverse.github.io",
  output: "static",
  devToolbar: {
    enabled: true,
  },
  build: {
    assets: "assets",
  },
  integrations: [
    mdx({
      remarkPlugins: [],
      gfm: true,
    }),
    sitemap(),
    react(),
    tailwind(),
  ],
  vite: {
    server: {
      allowedHosts: ["localhost", ".ngrok-free.app"],
    },
    preview: {
      allowedHosts: ["localhost", ".ngrok-free.app"],
    },
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
