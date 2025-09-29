import { colorOptions } from "@/shared/constants/colors";
import { Label } from "@/shared/ui/label";

export default function ColorSelect({
  selectedColor,
  onClick,
}: {
  selectedColor: string;
  onClick: (color: string) => void;
}) {
  return (
    <div className="flex gap-1">
      <Label className="lock text-sm mb-1 text-gray-600">Color: </Label>
      <div className="flex gap-1">
        {colorOptions.map((colorOption) => (
          <button
            key={colorOption.name}
            type="button"
            onClick={() => onClick(colorOption.name)}
            className={`w-6 h-6 rounded-full border-2 ${colorOption.bg} ${
              selectedColor === colorOption.name
                ? "border-gray-400"
                : "border-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
