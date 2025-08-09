import { passwordSchema } from "@/shared/validators";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    resetToken: z.string(),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
