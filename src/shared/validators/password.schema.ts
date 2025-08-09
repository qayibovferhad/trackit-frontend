import z from "zod";
import { PASSWORD_REGEX } from "../constants/regex";
import { PASSWORD_RULE_MESSAGE } from "../constants/messages";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must not exceed 64 characters")
  .regex(PASSWORD_REGEX, PASSWORD_RULE_MESSAGE);
