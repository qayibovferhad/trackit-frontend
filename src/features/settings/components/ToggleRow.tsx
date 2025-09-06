type ToggleRowProps = {
  title?: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
};

export function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled,
}: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        {title && (
          <div className="text-sm font-medium text-gray-900">{title}</div>
        )}
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>

      <label className="relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
        />
        <span
          className={
            "h-5 w-9 rounded-full transition-colors " +
            (checked ? "bg-indigo-600" : "bg-gray-300")
          }
        />
        <span
          className={
            "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform " +
            (checked ? "translate-x-4" : "")
          }
        />
      </label>
    </div>
  );
}
