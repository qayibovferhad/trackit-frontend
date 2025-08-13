import { Button } from "@/shared/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/resetPassword.schema";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordRequest } from "../services/auth.service";
import { getErrorMessage } from "@/shared/lib/error";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import { PasswordField } from "../components/PasswordField";
import { PATHS } from "@/shared/constants/routes";
import { ErrorAlert } from "@/shared/components/ErrorAlert";

export default function ResetPassword() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();

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
    onSuccess: () => {
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
      <AuthHeader
        icon={<KeyRound />}
        title="Set your new password"
        subtitle="Please enter your new password below."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          label="New Password"
          error={errors.newPassword}
          registration={register("newPassword")}
        />
        <PasswordField
          label="Confirm Password"
          error={errors.confirmPassword}
          registration={register("confirmPassword")}
        />
        {errorMessage && <ErrorAlert message={errorMessage} />}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full cursor-pointer"
        >
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </>
  );
}
