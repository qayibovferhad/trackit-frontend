import { NavItemLink } from "@/shared/components/NavItemLink";
import { NavList } from "@/shared/components/NavList";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/types/nav.types";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

type SidebarBaseProps = {
  items?: NavItem[];
  title?: string;
  showMobileTrigger?: boolean;
  widthClass?: string;
  headerSlot?: ReactNode;
};

export function SidebarBase({
  items = [],
  title = "Menu",
  showMobileTrigger = true,
  headerSlot,
  widthClass = "w-64",
}: SidebarBaseProps) {
  return (
    <>
      {showMobileTrigger && (
        <div className="md:hidden sticky top-0 z-50 flex h-14 items-center border-b bg-gray-100 px-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open sidebar">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SidebarContent
                title={title}
                items={items}
                headerSlot={headerSlot}
              />
            </SheetContent>
          </Sheet>
          <div className=" text-sm font-semibold">
            {headerSlot ? (
              <div>{headerSlot}</div>
            ) : (
              <div className="flex h-14 items-center px-4 text-base font-normal">
                {title}
              </div>
            )}
          </div>
        </div>
      )}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 z-40 h-full flex-col border-r bg-gray-100",
          widthClass
        )}
        aria-label="Primary navigation"
      >
        <SidebarContent title={title} items={items} headerSlot={headerSlot} />
      </aside>
    </>
  );
}

export function SidebarContent({
  title,
  items,
  headerSlot,
}: {
  title: string;
  headerSlot?: ReactNode;
  items: NavItem[];
}) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemKey: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  const regularItems = items.filter(
    (item) => item.label?.toLowerCase() !== "boards"
  );
  const boardsItem = items.find(
    (item) => item.label?.toLowerCase() === "boards"
  );

  return (
    <div className="flex h-full flex-col bg-gray-100">
      <div>
        {headerSlot ? (
          <div className="px-4 py-3">{headerSlot}</div>
        ) : (
          <div className="flex h-14 items-center px-4 text-base font-normal">
            {title}
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          <NavList items={regularItems} className="space-y-1" />
          {boardsItem && (
            <div className="space-y-1">
              <button
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition mb-5 w-full justify-between",
                  "text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => toggleItem("boards")}
              >
                <div className="flex items-center gap-3">
                  {boardsItem.icon && <boardsItem.icon className="size-5" />}
                  <span className="truncate text-gray-700">
                    {boardsItem.label}
                  </span>
                </div>
                {expandedItems.has("boards") ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </button>
              {expandedItems.has("boards") && (
                <div className="ml-6 space-y-1">
                  <NavItemLink
                    to="/boards/team-alpha"
                    label="Team Alpha"
                    exact={false}
                  />
                  <NavItemLink
                    to="/boards/team-beta"
                    label="Team Beta"
                    exact={false}
                  />
                  <NavItemLink
                    to="/boards/team-gamma"
                    label="Team Gamma"
                    exact={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
