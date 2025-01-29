import { z } from "zod";

export const experienceSchema = z.object({
  id: z.number(),
  role: z.string(),
  company: z.string(),
  period: z.object({
    start: z.string(), // "2023" 또는 "2023-03" 형식
    end: z.string().optional(), // 현재 진행중인 경우 undefined
  }),
  description: z.array(z.string()), // 업무 내용 리스트
  skills: z.array(z.number()), // 관련 스택 ID 배열
});

export type Experience = z.infer<typeof experienceSchema>;
