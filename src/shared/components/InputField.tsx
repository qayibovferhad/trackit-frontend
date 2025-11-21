import type { FieldError } from "react-hook-form";
import { FormField } from "./FormField";

type InputFieldProps = {
  label?: string;
  error?: FieldError;
  htmlFor: string;
  type?: string;
  register?: any;
  className?: string;
  placeholder?:string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function InputField({
  label,
  error,
  htmlFor,
  type = "text",
  register,
  className = "",
  onChange,
  placeholder
}: InputFieldProps) {
  const base =
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none";

  return (
    <FormField label={label} error={error} htmlFor={htmlFor}>
      <input
        id={htmlFor}
        type={type}
        autoFocus={false}
        {...(register ? register(htmlFor) : {})}
        className={`${base} ${className}`}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FormField>
  );
}
