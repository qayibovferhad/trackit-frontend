import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgetPasswordFormData,
} from "../schemas/forgotPassword.schema";
import { Button } from "@/shared/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/error";
import { useState } from "react";
import { forgotPasswordRequest } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/constants";
import AuthHeader from "../components/AuthHeader";
import { ErrorAlert } from "../components/ErrorAlert";
import { FormField } from "@/shared/components/FormField";

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
    onSuccess: () => {
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });
  async function onSubmit(data: ForgetPasswordFormData) {
    await mutateAsync(data);
    navigate(`${PATHS.VERIFY_OTP}?email=${encodeURIComponent(data.email)}`);
  }
  return (
    <>
      <AuthHeader
        icon={<Lock />}
        title="Forgot Password?"
        subtitle="We'll send new password link to email"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email address" error={errors.email} htmlFor="email">
          <input
            type="text"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </FormField>
        <ErrorAlert message={errorMessage} />
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
