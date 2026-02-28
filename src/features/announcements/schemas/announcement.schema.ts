import z from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description is too long"),
  teamId: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;
