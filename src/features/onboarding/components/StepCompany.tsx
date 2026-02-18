import { Check } from "lucide-react";
import { COMPANY_SECTORS, COMPANY_SIZES } from "../constants";

export function StepCompany({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Company name</label>
        <input
          className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-violet-400 transition-colors"
          placeholder="Acme Inc."
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sector</label>
        <div className="grid grid-cols-2 gap-2">
          {COMPANY_SECTORS.map((s) => {
            const isSelected = data.sector === s;
            return (
              <button
                key={s}
                onClick={() => onChange({ ...data, sector: s })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-medium text-left transition-all cursor-pointer
                  ${isSelected ? "border-violet-500 bg-violet-50 text-violet-600" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
              >
                <span className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${isSelected ? "border-violet-500 bg-violet-500 text-white" : "border-gray-300"}`}>
                  {isSelected && <Check />}
                </span>
                {s}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Team size</label>
        <div className="flex gap-2 flex-wrap">
          {COMPANY_SIZES.map((sz) => (
            <button
              key={sz}
              onClick={() => onChange({ ...data, size: sz })}
              className={`px-4 py-1.5 rounded-full border-2 text-xs font-medium transition-all cursor-pointer
                ${data.size === sz ? "border-violet-500 bg-violet-50 text-violet-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
