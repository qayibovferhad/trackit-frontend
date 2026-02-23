import { useMemo } from "react";
import { calcStarter, calcPremium } from "../utils/pricing";
import { FREE_FEATURES } from "../constants";
import type { Plan, BillingPeriod } from "../types/subscription.types";

export function usePlans(users: number, billing: BillingPeriod): Plan[] {
  const isYearly = billing === "yearly";

  const starter = useMemo(() => calcStarter(users, isYearly), [users, isYearly]);
  const premium = useMemo(() => calcPremium(users, isYearly), [users, isYearly]);

  return useMemo(
    () => [
      {
        name: "Free Plan",
        price: 0,
        features: FREE_FEATURES,
        isCurrent: true,
        cta: null,
        highlight: false,
        planKey: "FREE",
      },
      {
        name: "Starter Plan",
        price: starter.price,
        features: starter.features,
        isCurrent: false,
        cta: "Get Started",
        highlight: false,
        planKey: "STARTER",
      },
      {
        name: "Premium Plan",
        price: premium.price,
        features: premium.features,
        isCurrent: false,
        cta: "Get Premium",
        highlight: true,
        planKey: "PREMIUM",
      },
    ],
    [starter, premium]
  );
}
