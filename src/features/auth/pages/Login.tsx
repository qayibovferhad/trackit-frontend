import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import GoogleIcon from "../../../assets/icons/google-icon.png";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../services/auth.service";
import { getErrorMessage } from "../../../lib/error";
import { Button } from "@/shared/ui/button";
import AuthHeader from "../components/AuthHeader";
import { ErrorAlert } from "../components/ErrorAlert";
import { FormField } from "@/shared/components/FormField";
import { PasswordField } from "../components/PasswordField";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginRequest,
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
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };
  return (
    <>
      <AuthHeader
        icon={<>🙂</>}
        title="Sign in to Trackit"
        subtitle={
          <>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </>
        }
      />
      <div className="space-y-2">
        <button className="w-full cursor-pointer flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50">
          <img src={GoogleIcon} alt="Google" className="w-4 h-4 mr-2" />
          Sign up with Google
        </button>
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

        <PasswordField
          label="Password"
          error={errors.password}
          registration={register("password")}
        />

        <div className="mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <ErrorAlert message={errorMessage} />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
}
