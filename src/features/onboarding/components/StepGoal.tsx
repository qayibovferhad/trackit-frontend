import { Check } from "lucide-react";
import { COMPANY_GOALS } from "../constants";

export function StepGoal({ value, onChange }: { value: string | undefined; onChange: (v: "task_tracking" | "team_management" | "project_planning" | "performance") => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      {COMPANY_GOALS.map((goal) => {
        const selected = value === goal.id;
        return (
          <button
            key={goal.id}
            type="button"
            onClick={() => onChange(goal.id as any)}
            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer w-full
              ${selected ? "border-violet-500 bg-violet-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <span className={`text-xl w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
              ${selected ? "bg-violet-100" : "bg-gray-100"}`}>
              {goal.emoji}
            </span>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${selected ? "text-violet-600" : "text-gray-800"}`}>
                {goal.title}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{goal.subtitle}</div>
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
