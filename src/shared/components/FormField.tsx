import type { FieldError } from "react-hook-form";

export function FormField({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
