// tailwind.config.js (CommonJS 방식 예시)
import typography from "@tailwindcss/typography";
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", "[data-theme='dark']"],
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,css}",
    "./storybook/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,css}",
  ],
  screens: {
    xs: "375px", // iphone se보다 작은 화면
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  theme: {
    extend: {
      /* text color */
      textColor: {
        skin: {
          base: withOpacity("--color-base"),
          accent: withOpacity("--color-accent"),
          secondary: withOpacity("--color-secondary"),
          inverted: withOpacity("--color-fill"),
          danger: withOpacity("--color-danger"),
          success: withOpacity("--color-success"),
          warning: withOpacity("--color-warning"),
        },
        black: {
          base: withOpacity("--color-black-base"),
          accent: withOpacity("--color-black-accent"),
          muted: withOpacity("--color-black-muted"),
        },
        white: {
          base: withOpacity("--color-white-base"),
          accent: withOpacity("--color-white-accent"),
          muted: withOpacity("--color-white-muted"),
        },
      },
      /* background color */
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          accent: withOpacity("--color-accent"),
          secondary: withOpacity("--color-secondary"),
          inverted: withOpacity("--color-text-base"),
          background: withOpacity("--color-background"),
          danger: withOpacity("--color-danger"),
          success: withOpacity("--color-success"),
          warning: withOpacity("--color-warning"),
        },
      },
      /* gradient color stops */
      gradientColorStops: {
        skin: {
          fill: withOpacity("--color-fill"),
          base: withOpacity("--color-base"),
          accent: withOpacity("--color-accent"),
          secondary: withOpacity("--color-secondary"),
          inverted: withOpacity("--color-text-base"),
          background: withOpacity("--color-background"),
        },
      },
      /* Base 그라데이션 배경 유틸리티 추가 */
      backgroundImage: {
        "base-gradient":
          "linear-gradient(270deg, rgb(var(--base-gradient-start)), rgb(var(--base-gradient-mid)), rgb(var(--base-gradient-end)))",
      },
      keyframes: {
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseCustom: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        fadeInDown: {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeInUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        // "float-0": {
        //   "0%": { opacity: 1 },
        //   "25%": { opacity: 0.5 },
        //   "50%": { opacity: 0 },
        //   "75%": { opacity: 0.5 },
        //   "100%": { opacity: 1 },
        // },
        // "float-1": {
        //   "0%": {
        //     transform: "rotate(0deg) translate(-50%, -50%)",
        //     opacity: "1",
        //   },
        //   // "25%": {
        //   //   transform: "rotate(-90deg) translate(-100%, -100%)",
        //   //   opacity: "1",
        //   // },
        //   "50%": {
        //     transform: "rotate(-180deg) translate(-150%, -150%)",
        //     opacity: "1",
        //   },
        //   // "75%": {
        //   //   transform: "rotate(-270deg) translate(-100%, -100%)",
        //   //   opacity: "1",
        //   // },
        //   "100%": {
        //     transform: "rotate(-360deg) translate(-50%, -50%)",
        //     opacity: "1",
        //   },
        // },
        // "float-2": {
        //   "0%": {
        //     transform: "rotate(0deg) translate(-50%, -50%)",
        //     opacity: "1",
        //   },
        //   "50%": {
        //     transform: "rotate(180deg) translate(50%, 50%)",
        //     opacity: "1",
        //   },
        //   "100%": {
        //     transform: "rotate(360deg) translate(-50%, -50%)",
        //     opacity: "1",
        //   },
        // },
        gradientShift: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      animation: {
        loading: "loading 1.5s infinite",
        "fadeInDown-1s": "fadeInDown 1s ease forwards",
        "fadeInUp-1s": "fadeInUp 1s ease forwards",
        "fadeInUp-1.2s": "fadeInUp 1.2s ease forwards",
        "fadeInUp-1.4s": "fadeInUp 1.4s ease forwards",
        // "float-0": "float-0 6s linear infinite",
        // "float-1": "float-1 12s linear infinite",
        // "float-2": "float-2 12s linear infinite",
        gradientShift: "gradientShift 15s ease infinite",
      },
      outlineColor: {
        skin: {
          fill: withOpacity("--color-accent"),
        },
      },
      borderColor: {
        skin: {
          line: withOpacity("--color-border"),
          fill: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
      },
      fill: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
        transparent: "transparent",
      },
      stroke: {
        skin: {
          accent: withOpacity("--color-accent"),
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Pretendard", "ui-monospace", "monospace"],
        body: ["PurenJeonnam", "sans-serif"],
        logo: ["BOKEH", "sans-serif"],
        code: ["Fira Code", "monospace"],
      },
      typography: theme => ({
        sm: {
          css: {
            "max-width": "none",
            "margin-left": "auto",
            "margin-right": "auto",
            img: {
              width: "initial",
              margin: "0 auto",
            },
            code: {
              letterSpacing: "0.05em",
            },
          },
        },
        DEFAULT: {
          css: {
            "max-width": "76ch",
            "margin-left": "auto",
            "margin-right": "auto",
            img: {
              width: "initial",
              margin: "0 auto",
            },
            blockquote: {
              quotes: "none",
            },
            a: { color: theme("textColor.skin.accent"), lineBreak: "anywhere" },
            pre: { color: theme("textColor.skin.accent") },
            code: {
              color: theme("textColor.skin.accent"),
              backgroundColor: theme("backgroundColor.skin.fill"),
              borderRadius: "0.25rem",
              padding: "0.25rem",
              fontFamily: "Fira Code",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            h1: { fontFamily: "Noto Sans KR" },
            h2: { fontFamily: "Noto Sans KR" },
            h3: { fontFamily: "Noto Sans KR" },
            h4: { fontFamily: "Noto Sans KR" },
            h5: { fontFamily: "Noto Sans KR" },
            h6: { fontFamily: "Noto Sans KR" },
          },
        },
      }),
    },
  },
  plugins: [typography],
  // safelist: ["animate-float-0", "animate-float-1", "animate-float-2"],
};
