import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export default function DraggableWidget({ id, children, actions }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute right-2 top-3 flex items-center gap-1 z-10">
        {actions}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-50"
        >
          <GripVertical size={18} className="text-gray-400" />
        </div>
      </div>
      {children}
    </div>
  );
}
