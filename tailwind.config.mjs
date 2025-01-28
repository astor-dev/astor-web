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
        },
        white: {
          base: withOpacity("--color-white-base"),
          accent: withOpacity("--color-white-accent"),
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
      keyframes: {
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        floating0: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floating1: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        floating2: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
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
        float: {
          "0%": {
            transform: "translate(0, 0) rotate(0deg)",
            opacity: "0",
          },
          "10%": {
            opacity: "0.5",
          },
          "25%": {
            transform: "translate(15px, -15px) rotate(90deg)",
          },
          "50%": {
            transform: "translate(-5px, 20px) rotate(180deg)",
          },
          "75%": {
            transform: "translate(-20px, -15px) rotate(270deg)",
          },
          "90%": {
            opacity: "0.5",
          },
          "100%": {
            transform: "translate(0, 0) rotate(360deg)",
            opacity: "0",
          },
        },
      },
      animation: {
        "floating-0": "floating0 5s ease-in-out infinite",
        "floating-1": "floating1 5s ease-in-out infinite",
        "floating-2": "floating2 5s ease-in-out infinite",
        loading: "loading 1.5s infinite",
        "fadeInDown-1s": "fadeInDown 1s ease forwards",
        "fadeInUp-1s": "fadeInUp 1s ease forwards",
        "fadeInUp-1.2s": "fadeInUp 1.2s ease forwards",
        "fadeInUp-1.4s": "fadeInUp 1.4s ease forwards",
        float: "float 10s ease-in-out infinite",
      },
      /* outline color */
      outlineColor: {
        skin: {
          fill: withOpacity("--color-accent"),
        },
      },
      /* border color */
      borderColor: {
        skin: {
          line: withOpacity("--color-border"),
          fill: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
      },
      /* fill (SVG 등) */
      fill: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
        transparent: "transparent",
      },
      /* stroke (SVG 등) */
      stroke: {
        skin: {
          accent: withOpacity("--color-accent"),
        },
      },
      /* 폰트 패밀리 설정 */
      fontFamily: {
        sans: ["SUIT Variable", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      /* Typography 플러그인 설정 */
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: false,
            },
            code: {
              color: false,
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
