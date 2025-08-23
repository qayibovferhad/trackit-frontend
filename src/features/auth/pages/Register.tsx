import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../services/auth.service";
import { getErrorMessage } from "../../../shared/lib/error";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/register.schema";
import { Button } from "@/shared/ui/button";
import AuthHeader from "../components/AuthHeader";
import { FormField } from "@/shared/components/FormField";
import { PasswordField } from "../components/PasswordField";
import { PATHS } from "@/shared/constants/routes";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Register() {
  const { mutate: registerFn, isPending } = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = (data: RegisterFormData) => {
    registerFn(data);
  };
  return (
    <>
      <AuthHeader
        icon={<>🙂</>}
        title="Sign Up to Trackit"
        subtitle={
          <>
            Already have an account?{" "}
            <Link to={PATHS.LOGIN} className="text-blue-600 hover:underline">
              Login
            </Link>
          </>
        }
      />
      <div className="space-y-2">
        <GoogleAuthButton text="Sign up with Google" />
      </div>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-2 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email address" error={errors.email} htmlFor="email">
          <input
            type="text"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </FormField>

        <FormField label="Username" error={errors.username} htmlFor="username">
          <input
            type="text"
            {...register("username")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </FormField>

        <PasswordField
          label="Password"
          error={errors.password}
          registration={register("password")}
        />

        <div
          className={`transition-opacity duration-300 ${
            errorMessage ? "opacity-100" : "opacity-0 h-0"
          }`}
        >
          {errorMessage && <ErrorAlert message={errorMessage} />}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating account..." : "Register Now"}
        </Button>
      </form>
    </>
  );
}
