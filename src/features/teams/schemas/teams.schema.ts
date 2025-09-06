import z from "zod";

export const MemberSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "member"], {
    errorMap: () => ({ message: "Role must be admin or member" }),
  }),
});

export const teamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(60, "Team name is too long"),
  description: z
    .string()
    .max(300, "Description is too long")
    .optional()
    .or(z.literal("")),
  members: z.array(MemberSchema).default([]),
});

export type AddTeamFormData = z.infer<typeof teamSchema>;
