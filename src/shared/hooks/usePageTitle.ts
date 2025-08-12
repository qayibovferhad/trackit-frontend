import type { NavItem } from "@/shared/types/nav.types";
import { useLocation } from "react-router-dom";

export function usePageTitle(menus?: NavItem[], fallback?: string) {
  const { pathname } = useLocation();

  if (menus?.length) {
    const exactMatch = [...menus]
      .sort((a, b) => (b.to?.length ?? 0) - (a.to?.length ?? 0))
      .find((m) => pathname === m.to || pathname.startsWith(`${m.to}/`));

    if (exactMatch) return exactMatch.name || exactMatch.label;

    const firstSegment = "/" + pathname.split("/").filter(Boolean)[0];
    const topLevelMatch = menus.find((m) => m.to === firstSegment);

    if (topLevelMatch) return topLevelMatch.name || topLevelMatch.label;
  }

  if (fallback) return fallback;

  const lastSeg = pathname.split("/").filter(Boolean).pop() ?? "";
  return lastSeg ? lastSeg.charAt(0).toUpperCase() + lastSeg.slice(1) : "Home";
}
