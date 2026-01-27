import { randomColors } from "@/shared/constants/colors";

export const getTagColor = (tag: string) => {
  const hash = tag.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return randomColors[Math.abs(hash) % randomColors.length];
};