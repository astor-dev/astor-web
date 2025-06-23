import { z } from "zod";
// import { fakerKO as faker } from "@faker-js/faker";
import type { IconType } from "react-icons";
export const stackTypeEnum = z.enum(["Frontend", "Backend", "DevOps"]);
export type StackType = z.infer<typeof stackTypeEnum>;

export const stackSchema = z.object({
  id: z.number(),
  stackType: z.array(stackTypeEnum),
  name: z.string(),
  icon: z.custom<IconType>(() => true),
  description: z.string(),
  color: z.string(),
  featured: z.boolean(),
  superFeatured: z.boolean().optional(),
});
export type Stack = z.infer<typeof stackSchema>;

// export function createMockedStack(): Stack {
//   return {
//     id: faker.number.int(),
//     stackType: faker.helpers.arrayElement(stackTypeEnum.options),
//     name: faker.lorem.word(),
//     icon: faker.helpers.arrayElement(stacks.map(stack => stack.icon)),
//   };
// }
