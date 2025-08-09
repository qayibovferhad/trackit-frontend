import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyOtpSchema,
  type VerifyOtpFormData,
} from "../schemas/verifyOtp.schema";
import { useMutation } from "@tanstack/react-query";
import { verifyOtpRequest } from "../services/auth.service";
import { getErrorMessage } from "@/lib/error";
import { PATHS } from "@/routes/constants";
import AuthHeader from "../components/AuthHeader";
import { ErrorAlert } from "../components/ErrorAlert";
import OtpInput from "../components/OtpInput";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string>("");
  const [params] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const email = (params.get("email") || "").trim().toLowerCase();

  const navigate = useNavigate();
  useEffect(() => {
    if (!email) navigate(PATHS.FORGOT_PASSWORD);
  }, [email, navigate]);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  const handleOtpChange = (val: string) => {
    setOtp(val);
    setValue("otp", val);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: (data) => {
      setErrorMessage(null);
      navigate(`${PATHS.RESET_PASSWORD}?resetToken=${data.resetToken}`);
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const onSubmit = async (data: VerifyOtpFormData) => {
    await mutateAsync(data);
  };
  return (
    <>
      <AuthHeader
        icon={<Mail />}
        title="Verify email address"
        subtitle="Enter OTP send to your email"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center gap-1">
          <OtpInput value={otp} onChange={handleOtpChange} />
          {errors.otp && (
            <p className="text-sm text-red-600 mt-1">{errors.otp.message}</p>
          )}
        </div>
        <ErrorAlert message={errorMessage} />

        <Button
          disabled={isPending}
          type="submit"
          className="w-full cursor-pointer"
        >
          {isPending ? "Verifying" : "Verify Now"}
        </Button>
      </form>
    </>
  );
}
