import z from "zod";
import { USERNAME_REGEX } from "@/shared/constants/regex";

export const profileDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      USERNAME_REGEX,
      "Username can only contain letters, numbers, and underscores"
    ),
    description:z.string().optional()
});

export const emailUpdateSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const phoneUpdateSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

export type ProfileDetailsFormData = z.infer<typeof profileDetailsSchema>;
export type EmailUpdateFormData = z.infer<typeof emailUpdateSchema>;
export type PhoneUpdateFormData = z.infer<typeof phoneUpdateSchema>;
