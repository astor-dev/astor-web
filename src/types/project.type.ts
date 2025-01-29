import { z } from "zod";
import { fakerKO as faker } from "@faker-js/faker";
import image from "~/assets/images/image.png";
export const RoleEnum = z.enum([
  "Front-end",
  "Back-end",
  "F/B-end",
  "Infra",
  "UI/UX",
  "Design",
  "Plan",
  "Etc",
]);
export type Role = z.infer<typeof RoleEnum>;

export const projectTypeEnum = z.enum([
  "Toy-project",
  "Side-project",
  "Company-project",
]);
export type ProjectType = z.infer<typeof projectTypeEnum>;

export const projectSchema = z
  .object({
    id: z.number(),
    projectType: projectTypeEnum,
    imageUrl: z.string(),
    siteUrl: z.string().url(),
    roles: z.array(RoleEnum),
    companyName: z.string(),
    projectName: z.string(),
    shortDescription: z.string(),
    startedAt: z.string(),
    endedAt: z.string(),
    body: z.string(),
  })
  .strict();
export type Project = z.infer<typeof projectSchema>;

export function createMockedProject(): Project {
  const startedAt = faker.date.between({
    from: "2020-01-01",
    to: "2025-01-01",
  });
  const body = `
# ${faker.lorem.sentence()}

${faker.lorem.paragraph()}

## ${faker.lorem.sentence()} 

${faker.lorem.paragraphs(2)}

![${faker.lorem.words(3)}](${faker.image.url()})

### ${faker.lorem.sentence()}

${faker.lorem.paragraphs(2)}

- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()} 
- ${faker.lorem.sentence()}

### ${faker.lorem.sentence()}

${faker.lorem.paragraphs(1)}

![${faker.lorem.words(3)}](${faker.image.url()})
`;
  const endedAt = faker.date.between({ from: startedAt, to: "2025-01-01" });
  return projectSchema.parse({
    id: faker.number.int(),
    projectType: faker.helpers.arrayElement(projectTypeEnum.options),
    imageUrl: image.src,
    siteUrl: faker.internet.url(),
    roles: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
      faker.helpers.arrayElement(RoleEnum.options),
    ),
    companyName: faker.company.name(),
    projectName: faker.company.name(),
    shortDescription: faker.lorem.sentence(),
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    body,
  });
}
