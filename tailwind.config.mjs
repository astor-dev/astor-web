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
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
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
          base: withOpacity("--color-text-base"),
          "color-accent": withOpacity("--color-accent"),
          accent: withOpacity("--color-text-accent"),
          white: withOpacity("--color-text-white"),
          "white-accent": withOpacity("--color-text-white-accent"),
          inverted: withOpacity("--color-fill"),
        },
      },
      /* background color */
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          accent: withOpacity("--color-accent"),
          inverted: withOpacity("--color-text-base"),
          card: withOpacity("--color-card"),
          "card-muted": withOpacity("--color-card-muted"),
          background: withOpacity("--color-background"),
        },
      },
      keyframes: {
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
      },
      animation: {
        "floating-0": "floating0 5s ease-in-out infinite",
        "floating-1": "floating1 5s ease-in-out infinite",
        "floating-2": "floating2 5s ease-in-out infinite",
        // 유사하게 0/1/2 번 돌려가며 쓸 수 있음
        pulseCustom: "pulseCustom 8s ease-in-out infinite",
        "fadeInDown-1s": "fadeInDown 1s ease forwards",
        "fadeInUp-1s": "fadeInUp 1s ease forwards",
        "fadeInUp-1.2s": "fadeInUp 1.2s ease forwards",
        "fadeInUp-1.4s": "fadeInUp 1.4s ease forwards",
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
