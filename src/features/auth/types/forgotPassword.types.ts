import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email address"),
});

export type ForgetPasswordFormData = z.infer<typeof forgotPasswordSchema>;
