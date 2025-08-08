import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function ResetPassword() {
  return (
    <>
      {" "}
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="text-3xl text-amber-50 p-5 bg-purple-400 border border-purple-400 rounded-full">
          <Mail />
        </div>
        <h2 className="text-xl font-semibold tracking-wide">
          Verify email address
        </h2>
        <p className="text-sm text-gray-600">Enter OTP send to your email</p>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Verify Now
        </Button>
      </form>
    </>
  );
}
