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
  const errorMessage = error?.message || (error as any)?.value?.message;

  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm mb-1 text-gray-600">
        {label}
      </label>
      {children}
      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
