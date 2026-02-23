import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { Modal } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import { InputField } from "@/shared/components/InputField";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { getErrorMessage } from "@/shared/lib/error";
import { checkoutSchema } from "../schemas/checkout.schema";
import {
  activateRequest,
  createIntentRequest,
} from "../services/subscription.service";
import type { BillingPeriod, Plan } from "../types/subscription.types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: Plan;
  billing: BillingPeriod;
  seats: number;
  onSuccess: () => void;
};

type InnerProps = Omit<Props, "open" | "onOpenChange"> & {
  onError: (msg: string) => void;
};

function PaymentForm({ plan, billing, seats, onSuccess, onError }: InnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(checkoutSchema);

  const { mutate: activate, isPending: isActivating } = useMutation({
    mutationFn: activateRequest,
    onSuccess,
    onError: (err) => onError(getErrorMessage(err.message)),
  });

  const loading = isConfirming || isActivating;

  const onSubmit = handleSubmit(async () => {
    if (!stripe || !elements) return;

    setIsConfirming(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setIsConfirming(false);

    if (error) {
      onError(error.message ?? "Payment failed");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      activate({
        plan: plan.planKey as "STARTER" | "PREMIUM",
        billingPeriod: billing === "yearly" ? "YEARLY" : "MONTHLY",
        seats,
        paymentIntentId: paymentIntent.id,
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputField
        htmlFor="cardHolder"
        label="Cardholder Name"
        placeholder="John Doe"
        register={register}
        error={errors.cardHolder}
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Card Details</label>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full gap-2"
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
  open,
  onOpenChange,
  plan,
  billing,
  seats,
  onSuccess,
}: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const {
    mutate: createIntent,
    isPending: intentLoading,
    error: intentError,
    reset: resetIntent,
  } = useMutation({
    mutationFn: createIntentRequest,
    onSuccess: ({ clientSecret }) => setClientSecret(clientSecret),
  });

  useEffect(() => {
    if (open) {
      setClientSecret(null);
      setPayError(null);
      createIntent({
        plan: plan.planKey as "STARTER" | "PREMIUM",
        billingPeriod: billing === "yearly" ? "YEARLY" : "MONTHLY",
        seats,
      });
    } else {
      resetIntent();
    }
  }, [open]);

  function handleSuccess() {
    onOpenChange(false);
    onSuccess();
  }

  const description = `${plan.price > 0 ? `$${plan.price}/month` : "Free"} · ${seats} users · ${billing === "yearly" ? "Yearly" : "Monthly"}`;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={plan.name}
      description={description}
      size="md"
    >
      {intentError && (
        <ErrorAlert
          className="mb-4"
          message={getErrorMessage(intentError.message)}
        />
      )}

      {payError && (
        <ErrorAlert className="mb-4" message={payError} />
      )}

      {intentLoading || !clientSecret ? (
        <div className="py-10 text-center text-sm text-gray-400 animate-pulse">
          Loading payment form...
        </div>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#7c3aed",
                borderRadius: "8px",
                fontFamily: "inherit",
              },
            },
          }}
        >
          <PaymentForm
            plan={plan}
            billing={billing}
            seats={seats}
            onSuccess={handleSuccess}
            onError={setPayError}
          />
        </Elements>
      )}
    </Modal>
  );
}
