import { useMemo } from "react";
import { calcStarter, calcPremium } from "../utils/pricing";
import { FREE_FEATURES } from "../constants";
import type { Plan, BillingPeriod } from "../types/subscription.types";

export function usePlans(
  users: number,
  billing: BillingPeriod,
  currentPlanKey: "FREE" | "STARTER" | "PREMIUM" = "FREE",
): Plan[] {
  const isYearly = billing === "yearly";

  const starter = useMemo(() => calcStarter(users, isYearly), [users, isYearly]);
  const premium = useMemo(() => calcPremium(users, isYearly), [users, isYearly]);

  return useMemo(
    () => [
      {
        name: "Free Plan",
        price: 0,
        features: FREE_FEATURES,
        isCurrent: currentPlanKey === "FREE",
        cta: "Downgrade to Free",
        highlight: false,
        planKey: "FREE",
      },
      {
        name: "Starter Plan",
        price: starter.price,
        features: starter.features,
        isCurrent: currentPlanKey === "STARTER",
        cta: "Get Started",
        highlight: false,
        planKey: "STARTER",
      },
      {
        name: "Premium Plan",
        price: premium.price,
        features: premium.features,
        isCurrent: currentPlanKey === "PREMIUM",
        cta: "Get Premium",
        highlight: true,
        planKey: "PREMIUM",
      },
    ],
    [starter, premium, currentPlanKey]
  );
}
