import { useState } from "react";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free Plan",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Access to free files",
      "Access to free files",
      "Access to free files",
    ],
    isCurrent: true,
    cta: null,
    highlight: false,
  },
  {
    name: "Starter Plan",
    price: { monthly: 49, yearly: 39 },
    features: [
      "10 Users allowed",
      "25 boards and tasks",
      "Apps Integrations",
      "2 Tasks automation bots",
      "Community access",
    ],
    isCurrent: false,
    cta: "Subscribe Designer",
    highlight: false,
  },
  {
    name: "Premium Plan",
    price: { monthly: 99, yearly: 79 },
    features: [
      "Unlimited Users allowed",
      "Unlimitted boards and tasks",
      "Apps Integrations",
      "Unlimited tasks automation bots",
      "Community access",
    ],
    isCurrent: false,
    cta: "Subscribe Designer",
    highlight: true,
  },
];

const USER_MIN = 20;
const USER_MAX = 1000;
const USER_DEFAULT = 25;

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [users, setUsers] = useState(USER_DEFAULT);

  const sliderPercent =
    ((users - USER_MIN) / (USER_MAX - USER_MIN)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Upgrade to Premium Plan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Get Unlimited features with 50% Off in Yearly Plan
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              billing === "monthly"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              billing === "yearly"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* User Slider */}
      <div className="mb-10">
        <div className="relative mb-3">
          <input
            type="range"
            min={USER_MIN}
            max={USER_MAX}
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #7c3aed ${sliderPercent}%, #e5e7eb ${sliderPercent}%)`,
            }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{USER_MIN}</span>
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            {users} users
          </span>
          <span>{USER_MAX}+</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-bold text-gray-900">
                  ${billing === "yearly" ? plan.price.yearly : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && (
                  <span className="text-sm text-gray-400">/month</span>
                )}
              </div>

              <p className="text-xs font-semibold text-gray-500 mb-3">
                What's Included ?
              </p>

              <ul className="space-y-2.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        plan.isCurrent
                          ? "bg-gray-100"
                          : "bg-violet-100"
                      }`}
                    >
                      <Check
                        className={`w-2.5 h-2.5 ${
                          plan.isCurrent ? "text-gray-400" : "text-violet-600"
                        }`}
                        strokeWidth={3}
                      />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer of card */}
            <div className="mt-6">
              {plan.isCurrent ? (
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Current Plan
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ends on 20 may 2022
                  </p>
                </div>
              ) : (
                <button
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
        Terms and Policies : Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud{" "}
        <span className="font-semibold text-gray-600">Terms and Conditions</span>{" "}
        laboris nisi ut aliquip
      </p>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #7c3aed;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #7c3aed;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
