import { Modal } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/components/ErrorAlert";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  error?: string | null;
};

export default function DowngradeModal({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  error,
}: Props) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Downgrade to Free Plan"
      description="Your current subscription will be cancelled immediately."
      size="sm"
    >
      {error && <ErrorAlert className="mb-4" message={error} />}

      <p className="text-sm text-gray-600 mb-6">
        You will lose access to all paid features. This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <Button
          variant="soft"
          className="flex-1"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Keep Current Plan
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Cancelling..." : "Confirm Downgrade"}
        </Button>
      </div>
    </Modal>
  );
}
