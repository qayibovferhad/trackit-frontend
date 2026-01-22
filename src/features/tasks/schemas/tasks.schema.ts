import { TIME_REGEX } from "@/shared/constants/regex";
import z from "zod";

export const AssigneeSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  profileImage: z.string().nullable().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  dueDate: z.preprocess(
    (arg) => {
      if (!arg) return undefined;
      if (typeof arg === "string" || arg instanceof Date) {
        const d = new Date(arg);
        return isNaN(d.getTime()) ? undefined : d;
      }
      return undefined;
    },
    z.date().optional()
  ),
  tags: z.array(z.string().min(1)).optional().default([]),
  dueTime: z.preprocess(
    (val) => {
      if (val === "" || val === null) return undefined;
      return val;
    },
    z.string().regex(TIME_REGEX, "Invalid time").optional()
  ),
  assignee: AssigneeSchema,
  priority: z
    .enum(["low", "medium", "high"], {
      errorMap: () => ({ message: "Please select a priority." }),
    })
    .optional(),
  parentTaskId: z.string().optional(),
  team: z.string().optional()
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type AssigneeData = z.infer<typeof AssigneeSchema>;
