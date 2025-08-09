import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Locate } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../types/resetPassword.types";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordRequest } from "../services/auth.service";
import { getErrorMessage } from "@/lib/error";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PATHS } from "@/routes/constants";

export default function ResetPassword() {
  const [show, setShow] = useState({ password: false, confirm: false });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toggle = (field: "password" | "confirm") => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const resetToken = params.get("resetToken") || "";

  useEffect(() => {
    if (!resetToken) navigate(PATHS.FORGOT_PASSWORD);
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetToken: resetToken,
      confirmPassword: "",
      newPassword: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: (data) => {
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });
  const onSubmit = async (data: ResetPasswordFormData) => {
    await mutateAsync(data);
  };
  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="text-3xl text-amber-50 p-5 bg-purple-400 border border-purple-400 rounded-full">
          <Locate />
        </div>
        <h2 className="text-xl font-semibold tracking-wide">
          Set your new password
        </h2>
        <p className="text-sm text-gray-600">
          Please enter your new password below.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">New Password</label>
          <div className="relative">
            <input
              {...register("newPassword")}
              type={show.password ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => toggle("password")}
              className="absolute cursor-pointer inset-y-0 right-2 flex items-center text-gray-500 text-sm"
            >
              {show.password ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={show.confirm ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => toggle("confirm")}
              className="absolute cursor-pointer inset-y-0 right-2 flex items-center text-gray-500 text-sm"
            >
              {show.confirm ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          disabled={isPending}
          type="submit"
          className="w-full cursor-pointer"
        >
          Update password
        </Button>
      </form>
    </>
  );
}
