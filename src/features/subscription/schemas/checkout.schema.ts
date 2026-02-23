import { z } from "zod";

export const checkoutSchema = z.object({
  cardHolder: z.string().min(2, "Cardholder name is required"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
