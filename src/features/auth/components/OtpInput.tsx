import { useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
}
export default function OtpInput({
  value,
  onChange,
  length = 6,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = value.split("").slice(0, length);
  while (chars.length < length) chars.push("");

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...chars];
    next[index] = val;
    const joined = next.join("");
    onChange(joined);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !chars[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          value={ch}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:border-purple-500"
        />
      ))}
    </div>
  );
}
