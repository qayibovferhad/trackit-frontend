import { useState } from "react";
import { Plus } from "lucide-react";
import { columnSchema, type ColumnFormData } from "../../schemas/boards.schema";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import ColorSelect from "./ColorSelect";

export default function AddColumnButton({
  onAdd,
}: {
  onAdd: (column: ColumnFormData) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("gray");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = columnSchema.safeParse({ title, color } as ColumnFormData);
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      setError(first ? first.message : "Invalid input");
      return;
    }

    setSubmitting(true);
    try {
      const newColumn: ColumnFormData = {
        title: parsed.data.title.trim(),
        color: parsed.data.color,
      };

      onAdd(newColumn);

      setTitle("");
      setColor("gray");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="flex-shrink-0 w-80">
        <button
          onClick={() => setShowForm(true)}
          className="w-full h-36 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 transition"
          aria-label="Add column"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Plus className="w-5 h-5" />
            <span>Add column</span>
          </div>
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="flex-shrink-0 w-80">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4"
        >
          <input
            type="text"
            placeholder="Column title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 text-sm font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
            autoFocus
          />

          <ColorSelect
            selectedColor={color}
            onClick={(color) => setColor(color)}
          />

          {error && <ErrorAlert message={error} />}

          <div className="flex items-center gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setTitle("");
                setColor("gray");
                setError(null);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Column
            </button>
          </div>
        </form>
      </div>
    );
  }
}
