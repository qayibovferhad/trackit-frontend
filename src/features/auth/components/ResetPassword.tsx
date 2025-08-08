import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useRef, useState } from "react";

export default function ResetPassword() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // yalnız 1 rəqəm qəbul et
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
      <form className="space-y-4">
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

        <Button type="submit" className="w-full cursor-pointer">
          Verify Now
        </Button>
      </form>
    </>
  );
}
