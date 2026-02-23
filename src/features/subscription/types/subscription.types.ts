export type Plan = {
  name: string;
  price: number;
  features: string[];
  isCurrent: boolean;
  cta: string | null;
  highlight: boolean;
  planKey: "FREE" | "STARTER" | "PREMIUM";
};

export type BillingPeriod = "monthly" | "yearly";

export type CheckoutPayload = {
  plan: "STARTER" | "PREMIUM";
  billingPeriod: "MONTHLY" | "YEARLY";
  seats: number;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardHolder: string;
};

export type ActiveSubscription = {
  plan: "FREE" | "STARTER" | "PREMIUM";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  seats: number;
  priceAtPurchase: number;
  currentPeriodEnd: string | null;
};

export type Payment = {
  id: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  cardLast4: string;
  plan: "FREE" | "STARTER" | "PREMIUM";
  billingPeriod: "MONTHLY" | "YEARLY";
  createdAt: string;
};
