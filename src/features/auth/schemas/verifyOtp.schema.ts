import { z } from "zod";
import { emailSchema } from "@/shared/validators";

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
