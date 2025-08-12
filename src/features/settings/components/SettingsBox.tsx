import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import type { ReactNode } from "react";

type SettingsBoxProps = {
  title?: string;
  headerSlot?: ReactNode;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function SettingsBox({
  title,
  rightSlot,
  headerSlot,
  children,
}: SettingsBoxProps) {
  return (
    <Card className="border rounded-xl px-3">
      {headerSlot && <div>{headerSlot}</div>}
      {title && (
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-md font-medium text-foreground">
            {title}
          </CardTitle>
          {rightSlot}
        </CardHeader>
      )}
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
