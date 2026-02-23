import { api } from "@/shared/lib/axios";
import type { ActiveSubscription, Payment } from "../types/subscription.types";

export type CreateIntentPayload = {
  plan: "STARTER" | "PREMIUM";
  billingPeriod: "MONTHLY" | "YEARLY";
  seats: number;
};

export type ActivatePayload = CreateIntentPayload & {
  paymentIntentId: string;
};

export const createIntentRequest = async (
  data: CreateIntentPayload,
): Promise<{ clientSecret: string; amount: number }> => {
  const response = await api.post("/subscription/create-intent", data);
  return response.data;
};

export const activateRequest = async (data: ActivatePayload) => {
  const response = await api.post("/subscription/activate", data);
  return response.data;
};

export const getCurrentSubscriptionRequest = async (): Promise<ActiveSubscription> => {
  const response = await api.get("/subscription/current");
  return response.data;
};

export const cancelSubscriptionRequest = async () => {
  const response = await api.post("/subscription/cancel");
  return response.data;
};

export const getPaymentsRequest = async (): Promise<Payment[]> => {
  const response = await api.get("/subscription/payments");
  return response.data;
};
