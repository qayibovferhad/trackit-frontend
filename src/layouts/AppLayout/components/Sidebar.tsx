import { NavList } from "@/shared/components/NavList";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/types/nav.types";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";

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
        <NavList items={items} className="p-10 space-y-1" />
      </ScrollArea>
    </div>
  );
}
