import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  dueDate: z.date(),
  dueTime: z.date(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
