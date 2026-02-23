import { Zap } from "lucide-react";
import { USER_MAX, USER_MIN } from "../constants";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function UserSlider({ value, onChange }: Props) {
  const sliderPercent = ((value - USER_MIN) / (USER_MAX - USER_MIN)) * 100;

  return (
    <div className="mb-10">
      <div className="relative mb-3">
        <input
          type="range"
          min={USER_MIN}
          max={USER_MAX}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #7c3aed ${sliderPercent}%, #e5e7eb ${sliderPercent}%)`,
          }}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{USER_MIN}</span>
        <span className="flex items-center gap-1 font-medium text-gray-700">
          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          {value} users
        </span>
        <span>{USER_MAX}+</span>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          margin-top: -2px;
          border-radius: 50%;
          background: white;
          border: 2px solid #7c3aed;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #7c3aed;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          border: none;
        }
      `}</style>
    </div>
  );
}
