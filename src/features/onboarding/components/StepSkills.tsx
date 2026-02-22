import { Check } from "lucide-react";
import { PERSONAL_SKILLS } from "../constants";

export function StepSkills({ selected, onToggle }: { selected: string[]; onToggle: (skill: string) => void }) {
  const half = Math.ceil(PERSONAL_SKILLS.length / 2);
  const col1 = PERSONAL_SKILLS.slice(0, half);
  const col2 = PERSONAL_SKILLS.slice(half);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {[col1, col2].map((col, ci) => (
        <div key={ci} className="flex flex-col gap-2.5">
          {col.map((skill) => {
            const isSelected = selected.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => onToggle(skill)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all cursor-pointer w-full
                  ${isSelected ? "border-violet-500 bg-violet-50 text-violet-600" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
              >
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${isSelected ? "border-violet-500 bg-violet-500 text-white" : "border-gray-300"}`}>
                  {isSelected && <Check />}
                </span>
                {skill}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
