import type { Experience } from "~types/experience.type";

export const FEATURED_STACK_IDS = [
  1, // React
  2, // NestJS
  3, // Docker
  4, // Git
  // 5, // Kubernetes
  6, // Nginx
  7, // Python
  8, // TailwindCSS
  20, // Javascript
  9, // TypeScript
  10, // Next.js
  11, // MongoDB
  12, // PostgreSQL
  13, // Redis
  14, // AWS
  15, // GCP
  17, // Github Actions
  18, // GraphQL
  21, // Node.js
  22, // Astro
  23, // MySQL
  24, // Slack
  25, // Notion
  26, // Discord
  27, // Figma
  28, // Java
  29, // Kafka
  30, // gRPC
  31, // FastAPI
  32, // Spring
];

// id descending order
export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: "운영진",
    company: "고려대학교 소프트웨어 개발 학회 Devkor",
    period: {
      start: "2024",
      end: undefined, // Present
    },
    description: [
      "주요 프로젝트 아키텍처 설계 및 배포",
      "Kafka 기반의 이벤트 스트리밍 플랫폼 구현",
    ],
    skills: [2, 12, 14], // NestJS, PostgreSQL, AWS
  },
  {
    id: 2,
    role: "Software Engineer",
    company: "Previous Company",
    period: {
      start: "2020",
      end: "2023",
    },
    description: [
      "대규모 데이터 처리 시스템 최적화",
      "API Gateway 설계 및 보안 강화",
    ],
    skills: [7, 21, 3], // Python, Node.js, Docker
  },
];
