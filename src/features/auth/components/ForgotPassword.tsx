import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgetPasswordFormData,
} from "../types/forgotPassword.types";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: ForgetPasswordFormData) {
    console.log("data", data);
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
        <Button type="submit" className="w-full">
          Send Password Link
        </Button>
      </form>
    </>
  );
}
