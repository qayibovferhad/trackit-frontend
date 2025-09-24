import { NavList } from "@/shared/components/NavList";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/types/nav.types";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import BoardsItem from "./BoardsDropdown";
import type { Team } from "@/features/teams/types";

type SidebarBaseProps = {
  items?: NavItem[];
  title?: string;
  showMobileTrigger?: boolean;
  widthClass?: string;
  headerSlot?: ReactNode;
  teams?: Team[];
  isLoadingTeams: boolean;
};

export function SidebarBase({
  items = [],
  title = "Menu",
  teams = [],
  showMobileTrigger = true,
  headerSlot,
  widthClass = "w-64",
  isLoadingTeams,
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
                teams={teams}
                isLoadingTeams={isLoadingTeams}
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
        <SidebarContent
          title={title}
          items={items}
          headerSlot={headerSlot}
          teams={teams}
          isLoadingTeams={isLoadingTeams}
        />
      </aside>
    </>
  );
}

export function SidebarContent({
  title,
  items,
  headerSlot,
  teams = [],
  isLoadingTeams = false,
}: {
  title: string;
  headerSlot?: ReactNode;
  items: NavItem[];
  teams?: Team[];
  isLoadingTeams?: boolean;
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
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-1">
          <NavList items={regularItems} className="space-y-1" />
          {boardsItem && (
            <BoardsItem
              boardsItem={boardsItem}
              isExpanded={expandedItems.has("boards")}
              onToggle={() => toggleItem("boards")}
              teams={teams}
              isLoading={isLoadingTeams}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
