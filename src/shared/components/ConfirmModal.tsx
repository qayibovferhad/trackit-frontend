// src/shared/components/ConfirmDialog.tsx
import { useEffect, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { Modal } from "../ui/modal";

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  forceAction?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmModal({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  size = "sm",
  forceAction = false,
  onConfirm,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open && confirmRef.current) confirmRef.current.focus();
  }, [open]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (isLoading) return;
    if (e.key === "Enter") onConfirm();
    if (e.key === "Escape") onOpenChange(false);
  };

  const footer = (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={() => onOpenChange(false)}
      >
        {cancelText}
      </Button>
      <Button
        ref={confirmRef}
        type="button"
        variant="destructive"
        disabled={isLoading}
        onClick={() => onConfirm()}
      >
        {isLoading ? "Deleting..." : confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onOpenChange={(v) => !isLoading && onOpenChange(v)}
      title={title}
      description={description}
      size={size}
      footer={footer}
      forceAction={isLoading || forceAction}
    >
      <div onKeyDown={handleKeyDown} />
    </Modal>
  );
}
