import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../types/login.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleIcon from "../../../assets/icons/google-icon.png";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../services/auth.service";
import { getErrorMessage } from "../../../lib/error";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: login,
    error,
    isPending,
  } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
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

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };
  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="text-3xl">🙂</div>
        <h2 className="text-xl font-semibold">Sign in to Trackit</h2>
        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="space-y-2">
        <button className="w-full cursor-pointer flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50">
          <img src={GoogleIcon} alt="Google" className="w-4 h-4 mr-2" />
          Sign up with Google
        </button>
        {/* <button className="w-full cursor-pointer flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50">
          <img src={GoogleIcon} alt="Facebook" className="w-4 h-4 mr-2" />
          Sign up with Facebook
        </button> */}
      </div>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-2 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300" />
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

        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer inset-y-0 right-2 flex items-center text-gray-500 text-sm"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md w-full">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}
