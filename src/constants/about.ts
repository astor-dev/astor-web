import type { Experience } from "~types/experience.type";

export const FEATURED_STACK_IDS = [
  1, // React
  2, // NestJS
  7, // Python
  12, // PostgreSQL
  14, // AWS
  21, // Node.js
  3, // Docker
  5, // Kubernetes
  10, // TypeScript
  24, // Slack
  25, // Notion
  26, // Discord
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
