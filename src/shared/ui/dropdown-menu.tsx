import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/shared/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export function DropdownMenuRow({
  icon,
  label,
  onClick,
  danger,
  iconCircle = true,
  iconSize,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  iconCircle?: boolean;
  iconSize?: number;
}) {
  const size = iconSize ? iconSize : 7;
  return (
    <DropdownMenuItem
      onSelect={() => {
        // e.preventDefault();
        onClick();
      }}
      className={[
        "cursor-pointer rounded-md px-2 py-2 text-sm",
        "flex items-center gap-3",
        "focus:bg-muted focus:text-foreground",
        danger ? "text-red-600 focus:text-red-600" : "",
      ].join(" ")}
    >
      <span
        className={[
          iconCircle
            ? `size-${size} rounded-full bg-gray-100 text-gray-700 flex items-center justify-center`
            : "",
          "[&>svg]:size-4",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </DropdownMenuItem>
  );
}
