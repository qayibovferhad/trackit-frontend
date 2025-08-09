import { emailSchema } from "@/shared/validators";
import { passwordSchema } from "@/shared/validators/password.schema";
import { z } from "zod";

export const registerSchema = z.object({
  email: emailSchema,
  username: z.string().min(1, { message: "Username is required." }),
  password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;
