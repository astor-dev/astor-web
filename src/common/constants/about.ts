import type { EducationDetail } from "~features/about/components/education-list.astro";
import type { CertificationDetail } from "~features/about/components/certification-list.astro";

export const FEATURED_STACK_IDS: number[] = [
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
  26, // Disc ord
  27, // Figma
  28, // Java
  29, // Kafka
  30, // gRPC
  31, // FastAPI
  32, // Spring
];

export const EDUCATIONS: EducationDetail[] = [
  {
    school: "고려대학교 서울캠퍼스",
    majors: ["영어영문", "소프트웨어기술벤처"],
    degree: "학사",
    startedAt: "2020.03",
    endedAt: "2026.02",
    gpa: {
      score: 3.74,
      maxScore: 4.5,
    },
    description: `
영어학 전공자로서 촘스키의 '보편 문법'을 통해 <strong>인간 언어가 사고를 표현하는 추상화의 과정</strong>임을 배웠습니다.
이러한 '추상화' 개념이 단지 <strong>자연어</strong>에 국한되지 않고 <strong>더 낮은 수준의 언어 체계에도 동일하다는 생각</strong>에 보다 근본적 추상화인 <strong>기계어</strong>를 공부했습니다.
특히, <strong>소프트웨어</strong>가 이러한 추상화의 정점에서 실제적이고 구체적인 가치를 창출하는 점에 매료돼 전공하게 되었습니다.
`,
    activitiesAndAchievements: [
      "CS 핵심 전공 42학점 이수(운영체제, 네트워크, 소프트웨어공학, 클라우드 컴퓨팅 등)",
      "창업 경진대회 STARTUP EXPRESS 츄츄기업가상 수상(핸디버스)",
      "산학 캡스톤 디자인 프로젝트 우수상 수상",
      "영어영문학과 학생회 국원 및 영문학 소모임 LIT 부회장",
    ],
  },
];

export const CERTIFICATIONS: CertificationDetail[] = [
  {
    name: "정보처리기사",
    issuer: "한국산업인력공단",
    issuedAt: "2025.09",
  },
  {
    name: "SW역량테스트 Professional",
    issuer: "삼성SDS",
    issuedAt: "2025.08",
  },
  // {
  //   name: "군 장병 AI·SW 역량강화 교육",
  //   issuer: "정보통신기획평가원",
  //   type: "completion",
  //   issuedAt: "2023.08",
  //   description1:
  //     "Python 기반 머신러닝 기술을 활용한 인공지능 프로젝트 교육과정 수료",
  //   description2:
  //     "데이터 전처리, 모델 훈련, 성능 평가 등 실습을 통해 AI 개발 역량을 습득",
  // },
  // {
  //   name: "인공지능 BM 교육과정",
  //   issuer: "서울ICT이노베이션스퀘어",
  //   type: "completion",
  //   issuedAt: "2022.04",
  //   description1:
  //     "2022년 AI 연구 동향 및 RNN, CNN 등 딥러닝 모델의 동작 원리에 대한 이론적 학습",
  //   description2:
  //     "AI 기술을 활용한 스타트업 사례 분석 및 비즈니스 모델 기반 사업 계획서 작성",
  // },
];

export const ABOUT_ME = `
저는 소프트웨어 개발자 Astor입니다. <strong>소프트웨어 아키텍처</strong>에 깊은 관심을 가지고 있으며, 문제 해결을 위한 최적의 구조화된 소프트웨어를 설계하는 것을 즐깁니다.
<br />
스타트업의 <strong>초기 창업 멤버</strong>로서, 제로 베이스에서 견고한 아키텍처와 안정적인 시스템을 구축하여 일일 1000+ 건의 결제 요청을 성공적으로 처리하는 서비스를 개발했습니다.
<br />
급변하는 환경에서도 유연한 아키텍처를 통해 효율적인 시스템 운영을 실현하고, <strong>비즈니스 가치와 기술적 완성도를 균형 있게 달성</strong>하는 데 주력하고 있습니다.
`;
