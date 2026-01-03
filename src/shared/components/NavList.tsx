import type { NavListProps } from "../types/nav.types";
import { NavItemLink } from "./NavItemLink";

export function NavList({ items, className }: NavListProps) {
  return (
    <nav className={className}>
      {items.map(({ to, label, icon, exact,badge }) => (
        <NavItemLink key={to} to={to} label={label} icon={icon} exact={exact} badge={badge}/>
      ))}
    </nav>
  );
}
