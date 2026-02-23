import { Button } from "@/shared/ui/button";
import type { BillingPeriod } from "../types/subscription.types";

type Props = {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
};

export default function BillingToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("monthly")}
        className={value === "monthly" ? "bg-gray-100 text-gray-900" : "text-gray-500"}
      >
        Monthly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("yearly")}
        className={value === "yearly" ? "bg-gray-100 text-gray-900" : "text-gray-500"}
      >
        Yearly
      </Button>
    </div>
  );
}
