import React from "react";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  viteFinal: async config => {
    config.plugins = config.plugins || [];
    config.plugins.push(tsconfigPaths()); // tsconfig 경로 플러그인 추가

    // Tailwind CSS와 Autoprefixer 추가
    config.css = {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    };

    return config;
  },
};

export default config;
