import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { BillingPeriod, Plan } from "../types/subscription.types";

type Props = {
  plan: Plan;
  billing: BillingPeriod;
  onSubscribe?: (plan: Plan) => void;
};

export default function PlanCard({ plan, onSubscribe }: Props) {
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col justify-between min-h-[580px] transition-all duration-200 ${
        plan.highlight
          ? "bg-violet-600 shadow-xl shadow-violet-200 border-0"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          Most Popular
        </span>
      )}

      <div>
        <p
          className={`text-xs font-bold uppercase tracking-widest mb-5 ${
            plan.highlight ? "text-violet-200" : "text-gray-400"
          }`}
        >
          {plan.name}
        </p>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-5xl font-extrabold ${
                plan.highlight ? "text-white" : "text-gray-900"
              }`}
            >
              ${plan.price}
            </span>
            {plan.price > 0 && (
              <span
                className={`text-sm ml-1 ${
                  plan.highlight ? "text-violet-200" : "text-gray-400"
                }`}
              >
                /month
              </span>
            )}
          </div>
          {plan.price === 0 && (
            <p className={`text-sm mt-1 ${plan.highlight ? "text-violet-200" : "text-gray-400"}`}>
              Free forever
            </p>
          )}
        </div>

        <div className={`h-px mb-6 ${plan.highlight ? "bg-violet-500" : "bg-gray-100"}`} />

        <p
          className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
            plan.highlight ? "text-violet-200" : "text-gray-400"
          }`}
        >
          What's Included
        </p>

        <ul className="space-y-3.5">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  plan.highlight
                    ? "bg-violet-500"
                    : plan.isCurrent
                    ? "bg-gray-100"
                    : "bg-violet-100"
                }`}
              >
                <Check
                  className={`w-3 h-3 ${
                    plan.highlight
                      ? "text-white"
                      : plan.isCurrent
                      ? "text-gray-400"
                      : "text-violet-600"
                  }`}
                  strokeWidth={3}
                />
              </span>
              <span className={plan.highlight ? "text-white" : "text-gray-700"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-3">
        {plan.isCurrent && (
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${
            plan.highlight ? "text-violet-200" : "text-violet-600"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              plan.highlight ? "bg-violet-200" : "bg-violet-500"
            }`} />
            Active Plan
          </div>
        )}
        {!(plan.isCurrent && plan.planKey === "FREE") && (
          <Button
            variant={plan.isCurrent ? "soft" : plan.highlight ? "default" : "soft"}
            className={`w-full h-11 font-semibold ${
              !plan.isCurrent && plan.highlight ? "bg-white text-violet-600 hover:bg-violet-50" : ""
            }`}
            onClick={() => onSubscribe?.(plan)}
          >
            {plan.isCurrent ? "Change Plan" : plan.cta}
          </Button>
        )}
      </div>
    </div>
  );
}
