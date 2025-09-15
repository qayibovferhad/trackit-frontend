import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog"; // shadcn/ui
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
  children: ReactNode;
  forceAction?: boolean;
};

const sizeMap = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  footer,
  children,
  forceAction,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={forceAction ? () => {} : onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(sizeMap[size])}
        onInteractOutside={(e) => forceAction && e.preventDefault()}
      >
        {(title || description) && (
          <DialogHeader className="pb-4 border-b border-border">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
