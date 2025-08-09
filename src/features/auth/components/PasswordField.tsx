// features/auth/components/PasswordField.tsx
import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { FormField } from "@/shared/components/FormField";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

export function PasswordField({
  label,
  error,
  registration,
  ...props
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  const id = props.id || registration.name;

  return (
    <FormField label={label} error={error} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          {...registration}
          {...props}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm pr-10 ${
            props.className || ""
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500 text-sm"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </FormField>
  );
}
