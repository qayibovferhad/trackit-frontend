import z from "zod";

export const boardSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  teamId: z.string().uuid({ message: "Team must be selected." }),
});

export const columnSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  color: z.string(),
   type: z
    .enum(["TODO", "IN_PROGRESS", "DONE", "CUSTOM"])
    .nullable()
    .default(null), 
});

export type BoardFormData = z.infer<typeof boardSchema>;
export type ColumnFormData = z.infer<typeof columnSchema>;
