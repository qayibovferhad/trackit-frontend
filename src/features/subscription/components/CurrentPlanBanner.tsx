import { CalendarDays, Users, Zap } from "lucide-react";
import type { ActiveSubscription } from "../types/subscription.types";

type Props = {
  subscription: ActiveSubscription;
};

const PLAN_LABELS: Record<string, string> = {
  FREE: "Free Plan",
  STARTER: "Starter Plan",
  PREMIUM: "Premium Plan",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  EXPIRED: "bg-gray-100 text-gray-500",
};

export default function CurrentPlanBanner({ subscription }: Props) {
  const isPaid = subscription.plan !== "FREE";

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <Zap className="w-5 h-5 text-violet-600 fill-violet-600" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Current Plan</p>
          <p className="text-sm font-bold text-gray-900">
            {PLAN_LABELS[subscription.plan] ?? subscription.plan}
          </p>
        </div>
      </div>

      <div className="h-8 w-px bg-gray-100 hidden sm:block" />

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="w-4 h-4 text-gray-400" />
        <span>
          <span className="font-semibold text-gray-800">{subscription.seats}</span> seats
        </span>
      </div>

      {isPaid && subscription.currentPeriodEnd && (
        <>
          <div className="h-8 w-px bg-gray-100 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <span>
              Renews{" "}
              <span className="font-semibold text-gray-800">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>
        </>
      )}

      <div className="ml-auto">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            STATUS_STYLES[subscription.status] ?? "bg-gray-100 text-gray-500"
          }`}
        >
          {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase()}
        </span>
      </div>
    </div>
  );
}
