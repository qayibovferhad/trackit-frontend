import { emailSchema } from "@/shared/validators";
import { passwordSchema } from "@/shared/validators/password.schema";
import { USERNAME_REGEX } from "@/shared/constants/regex";
import { z } from "zod";

export const registerSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      USERNAME_REGEX,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;
