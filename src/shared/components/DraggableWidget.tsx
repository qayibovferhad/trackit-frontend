import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function DraggableWidget({ id, children }: { id: string; children: React.ReactNode }){
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle - always visible, top-right */}
      <div
        {...attributes}
        {...listeners}
        className="absolute right-1 top-1 cursor-grab active:cursor-grabbing z-10"
      >
        <div className="rounded-lg p-1 hover:bg-gray-50">
          <GripVertical size={20} className="text-gray-400" />
        </div>
      </div>
      {children}
    </div>
  );
};