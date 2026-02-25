import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import BillingToggle from "../components/BillingToggle";
import UserSlider from "../components/UserSlider";
import PlanCard from "../components/PlanCard";
import CheckoutModal from "../components/CheckoutModal";
import CurrentPlanBanner from "../components/CurrentPlanBanner";
import DowngradeModal from "../components/DowngradeModal";
import { usePlans } from "../hooks/usePlans";
import {
  useCurrentSubscription,
  SUBSCRIPTION_QUERY_KEY,
} from "../hooks/useCurrentSubscription";
import { cancelSubscriptionRequest } from "../services/subscription.service";
import { getErrorMessage } from "@/shared/lib/error";
import { USER_DEFAULT } from "../constants";
import type { BillingPeriod, Plan } from "../types/subscription.types";

export default function Subscription() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [users, setUsers] = useState(USER_DEFAULT);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showDowngrade, setShowDowngrade] = useState(false);
  const [downgradeError, setDowngradeError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: currentSub, isLoading } = useCurrentSubscription();

  const plans = usePlans(
    users,
    billing,
    currentSub?.status === "ACTIVE" ? (currentSub.plan ?? "FREE") : "FREE",
  );

  const { mutate: cancelSubscription, isPending: isCancelling } = useMutation({
    mutationFn: cancelSubscriptionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      setShowDowngrade(false);
      setDowngradeError(null);
      toast.success("Subscription cancelled successfully.");
    },
    onError: (err) => setDowngradeError(getErrorMessage(err.message)),
  });

  function handleSubscribe(plan: Plan) {
    if (plan.planKey === "FREE") {
      setDowngradeError(null);
      setShowDowngrade(true);
      return;
    }
    setSelectedPlan(plan);
  }

  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
    setSelectedPlan(null);
    toast.success("Subscription activated successfully!");
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

      {!isLoading && currentSub && (
        <CurrentPlanBanner subscription={currentSub} />
      )}

      <UserSlider value={users} onChange={setUsers} />

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

      <DowngradeModal
        open={showDowngrade}
        onOpenChange={(v) => {
          setShowDowngrade(v);
          if (!v) setDowngradeError(null);
        }}
        onConfirm={() => cancelSubscription()}
        isPending={isCancelling}
        error={downgradeError}
      />
    </div>
  );
}
