import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgetPasswordFormData,
} from "../types/forgotPassword.types";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/error";
import { useState } from "react";
import { forgotPasswordRequest } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/constants";

export default function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data) => {
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });
  async function onSubmit(data: ForgetPasswordFormData) {
    await mutateAsync(data);
    navigate(PATHS.RESETPASSWORD);
  }
  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="text-3xl text-amber-50 p-5 bg-purple-400 border border-purple-400 rounded-full">
          <Lock />
        </div>
        <h2 className="text-xl font-semibold tracking-wide">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-600">
          We'll send new password link to email
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <input
            type="text"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md w-full">
            {errorMessage}
          </p>
        )}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full cursor-pointer"
        >
          {isPending ? "Sending..." : "Send Password Link"}
        </Button>
      </form>
    </>
  );
}
