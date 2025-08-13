import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-red-700",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
