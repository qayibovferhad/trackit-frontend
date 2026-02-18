import { Check } from "lucide-react";
import { ACCOUNT_TYPES } from "../constants";

export function StepAccountType({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {ACCOUNT_TYPES.map((type) => {
        const selected = value === type.id;
        return (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer w-full
              ${selected ? "border-violet-500 bg-violet-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <span className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
              ${selected ? "bg-violet-100" : "bg-gray-100"}`}>
              {type.emoji}
            </span>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${selected ? "text-violet-600" : "text-gray-800"}`}>
                {type.title}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{type.subtitle}</div>
            </div>
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${selected ? "border-violet-500 bg-violet-500 text-white" : "border-gray-300"}`}>
              {selected && <Check />}
            </span>
          </button>
        );
      })}
    </div>
  );
}