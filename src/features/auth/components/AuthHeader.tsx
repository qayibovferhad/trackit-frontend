import type { ReactNode } from "react";

export default function AuthHeader({
  icon,
  title,
  subtitle,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center space-y-2 mb-6">
      {icon && (
        <div className="text-3xl text-amber-50 p-5 bg-purple-400 border border-purple-400 rounded-full">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold tracking-wide">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
}
