import z from "zod";

export const AssigneeSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  username: z.string().optional(),
  name: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  date: z.date(),
  time: z.date(),
  assignee: AssigneeSchema.optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type AssigneeData = z.infer<typeof AssigneeSchema>;
