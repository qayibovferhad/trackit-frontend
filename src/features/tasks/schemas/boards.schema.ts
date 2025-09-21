import z from "zod";

export const boardSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  teamId: z.string().uuid({ message: "Team must be selected." }),
});

export type BoardFormData = z.infer<typeof boardSchema>;
