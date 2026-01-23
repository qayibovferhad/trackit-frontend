import type { ColumnType } from "../../types/boards";

interface ColumnTypeSelectProps {
  value: ColumnType | null;
  onChange: (role: ColumnType | null) => void;
}

export default function ColumnTypeSelect({
  value,
  onChange,
}: ColumnTypeSelectProps) {
  const roles: { key: ColumnType; label: string; activeClass?: string }[] = [
    { key: "TODO", label: "Todo" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "DONE", label: "Completed", activeClass: "border-green-500 bg-green-50" },
    { key: "CUSTOM", label: "Custom", activeClass: "border-gray-500 bg-gray-50" },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
         Type:
      </label>

      <div className="mt-1 grid grid-cols-2 gap-2">
        {roles.map(({ key, label, activeClass }) => (
          <TypeButton
            key={key}
            active={value === key}
            onClick={() => onChange(value === key ? null : key)}
            activeClass={activeClass}
          >
            {label}
          </TypeButton>
        ))}
      </div>
    </div>
  );
}

interface TypeButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  activeClass?: string;
}

function TypeButton({
  children,
  active,
  onClick,
  activeClass = "border-violet-500 bg-violet-50",
}: TypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border p-2 text-sm transition ${
        active
          ? activeClass
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
