import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

type Size = "sm" | "md" | "lg";

const WRAP: Record<Size, string> = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

function initials(from?: string) {
  if (!from) return "U";
  const s = from.trim();
  if (!s) return "U";
  const parts = s.split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b || s[0]).toUpperCase();
}

type Props = {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: Size;
  className?: string;
  imageClassName?: string;
};

export default function UserAvatar({
  src,
  name,
  email,
  size = "md",
  className,
  imageClassName,
}: Props) {
  const label = name || email || "User";
  return (
    <Avatar
      className={cn(
        "rounded-full overflow-hidden border bg-white",
        WRAP[size],
        className
      )}
    >
      <AvatarImage
        src={src ?? undefined}
        alt={label}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
      <AvatarFallback className="text-[11px] bg-gray-100 text-gray-700">
        {initials(name || email || "")}
      </AvatarFallback>
    </Avatar>
  );
}
