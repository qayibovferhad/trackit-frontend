import { useState, useEffect } from "react";
import { Lock, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/shared/ui/button";
import {
  createIntentRequest,
  activateRequest,
} from "../services/subscription.service";
import type { BillingPeriod, Plan } from "../types/subscription.types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type Props = {
  plan: Plan;
  billing: BillingPeriod;
  seats: number;
  onClose: () => void;
  onSuccess: () => void;
};

type FormProps = {
  plan: Plan;
  billing: BillingPeriod;
  seats: number;
  paymentIntentId: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
};

function PaymentForm({
  plan,
  billing,
  seats,
  paymentIntentId,
  onSuccess,
  onError,
}: FormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      onError(error.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await activateRequest({
          plan: plan.planKey as "STARTER" | "PREMIUM",
          billingPeriod: billing === "yearly" ? "YEARLY" : "MONTHLY",
          seats,
          paymentIntentId: paymentIntent.id,
        });
        onSuccess();
      } catch {
        onError("Payment succeeded but activation failed. Please contact support.");
      }
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-11 font-semibold gap-2"
      >
        <Lock className="w-4 h-4" />
        {loading ? "Processing..." : `Pay $${plan.price}`}
      </Button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Secured by Stripe · Test mode
      </p>
    </form>
  );
}

export default function CheckoutModal({
  plan,
  billing,
  seats,
  onClose,
  onSuccess,
}: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [initError, setInitError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    createIntentRequest({
      plan: plan.planKey as "STARTER" | "PREMIUM",
      billingPeriod: billing === "yearly" ? "YEARLY" : "MONTHLY",
      seats,
    })
      .then(({ clientSecret }) => {
        setClientSecret(clientSecret);
        // extract intent id from client_secret
        setPaymentIntentId(clientSecret.split("_secret_")[0]);
      })
      .catch(() => setInitError("Could not initialize payment. Try again."));
  }, [plan.planKey, billing, seats]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-violet-600 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-0.5">
              Checkout
            </p>
            <h2 className="text-white text-lg font-bold">{plan.name}</h2>
            <p className="text-violet-200 text-sm mt-0.5">
              ${plan.price}/month · {seats} users ·{" "}
              {billing === "yearly" ? "Yearly" : "Monthly"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-violet-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {initError ? (
          <div className="px-6 py-8 text-center text-sm text-red-500">{initError}</div>
        ) : !clientSecret ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400 animate-pulse">
            Loading payment form...
          </div>
        ) : (
          <>
            {payError && (
              <div className="mx-6 mt-4 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">
                {payError}
              </div>
            )}
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#7c3aed",
                    borderRadius: "12px",
                    fontFamily: "inherit",
                  },
                },
              }}
            >
              <PaymentForm
                plan={plan}
                billing={billing}
                seats={seats}
                paymentIntentId={paymentIntentId}
                onSuccess={onSuccess}
                onError={setPayError}
              />
            </Elements>
          </>
        )}
      </div>
    </div>
  );
}
