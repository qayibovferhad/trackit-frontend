import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyOtpSchema,
  type VerifyOtpFormData,
} from "../types/verifyOtp.types";
import { useMutation } from "@tanstack/react-query";
import { verifyOtpRequest } from "../services/auth.service";
import { getErrorMessage } from "@/lib/error";
import { PATHS } from "@/routes/constants";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    setValue("otp", newOtp.join(""));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const { mutateAsync } = useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: (data) => {
      setErrorMessage(null);
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
      {" "}
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="text-3xl text-amber-50 p-5 bg-purple-400 `border border-purple-400 rounded-full">
          <Mail />
        </div>
        <h2 className="text-xl font-semibold tracking-wide">
          Verify email address
        </h2>
        <p className="text-sm text-gray-600">Enter OTP send to your email</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex justify-center gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:border-purple-500"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-sm text-red-600 mt-1">{errors.otp.message}</p>
          )}
        </div>
        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md w-full">
            {errorMessage}
          </p>
        )}
        <Button type="submit" className="w-full cursor-pointer">
          Verify Now
        </Button>
      </form>
    </>
  );
}
