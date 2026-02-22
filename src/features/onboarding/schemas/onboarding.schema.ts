import { z } from "zod";

export const onboardingSchema = z.object({
  accountType: z.enum(["personal", "company"]),
  skills: z.array(z.string()).optional(),
  companyName: z.string().optional(),
  companySector: z.string().optional(),
  companySize: z.string().optional(),
  experience: z.enum(["junior", "mid", "senior", "lead"]).optional(),
  role: z.enum(["ceo", "cto", "pm", "developer", "designer", "hr"]).optional(),
  goal: z.enum(["task_tracking", "team_management", "project_planning", "performance"]).optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
