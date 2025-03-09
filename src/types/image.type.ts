import { z } from "zod";

export const ImageKeyEnum = z.enum(["projects", "posts", "series"]);
export type ImageKey = z.infer<typeof ImageKeyEnum>;

export const ImageExtensionEnum = z.enum([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
]);
export type ImageExtension = z.infer<typeof ImageExtensionEnum>;
