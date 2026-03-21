import { memo } from "react";
import { MoreHorizontal } from "lucide-react";
import UserAvatar from "@/shared/components/UserAvatar";
import { SIDEBAR_W } from "../constants";

interface TimelineAssigneeSidebarProps {
  name: string;
  img?: string;
}

const TimelineAssigneeSidebar = memo(function TimelineAssigneeSidebar({
  name,
  img,
}: TimelineAssigneeSidebarProps) {
  return (
    <div
      className="sticky left-0 z-10 bg-white border-r border-gray-100 flex items-start gap-2.5 px-4 pt-4 shrink-0"
      style={{ width: SIDEBAR_W }}
    >
      <UserAvatar src={img} name={name} />
      <span className="text-sm font-medium text-gray-700 truncate mt-0.5">{name}</span>
      <MoreHorizontal className="size-4 text-gray-300 ml-auto shrink-0 mt-0.5" />
    </div>
  );
});

export default TimelineAssigneeSidebar;
