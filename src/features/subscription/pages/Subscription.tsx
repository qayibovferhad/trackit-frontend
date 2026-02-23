import { useState } from "react";
import BillingToggle from "../components/BillingToggle";
import UserSlider from "../components/UserSlider";
import PlanCard from "../components/PlanCard";
import CheckoutModal from "../components/CheckoutModal";
import { usePlans } from "../hooks/usePlans";
import { USER_DEFAULT } from "../constants";
import type { BillingPeriod, Plan } from "../types/subscription.types";

export default function Subscription() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [users, setUsers] = useState(USER_DEFAULT);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const plans = usePlans(users, billing);

  function handleSubscribe(plan: Plan) {
    setSuccessPlan(null);
    setSelectedPlan(plan);
  }

  function handleSuccess() {
    setSuccessPlan(selectedPlan?.name ?? null);
    setSelectedPlan(null);
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upgrade to Premium Plan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Get Unlimited features with 50% Off in Yearly Plan
          </p>
        </div>
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <UserSlider value={users} onChange={setUsers} />

      {successPlan && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl px-5 py-3">
          <span className="text-green-500 text-base">✓</span>
          <span><strong>{successPlan}</strong> activated successfully! Welcome aboard.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} onSubscribe={handleSubscribe} />
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
        Terms and Policies : Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud{" "}
        <span className="font-semibold text-gray-600">Terms and Conditions</span>{" "}
        laboris nisi ut aliquip
      </p>

      {selectedPlan && (
        <CheckoutModal
          open={!!selectedPlan}
          onOpenChange={(v) => !v && setSelectedPlan(null)}
          plan={selectedPlan}
          billing={billing}
          seats={users}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
