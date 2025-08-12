import { useState } from "react";
import type { NotifState } from "../types";
import { SettingsBox } from "../components/SettingsBox";
import { ToggleRow } from "../components/ToggleRow";
import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";

export default function NotificationSettings() {
  const [state, setState] = useState<NotifState>({
    generalEmails: true,
    userJoined: true,
    kitPurchase: true,
    kitLaunched: true,
    weeklyReport: true,
    newMessage: true,
  });
  const set = (k: keyof NotifState) => (v: boolean) =>
    setState((s) => ({ ...s, [k]: v }));
  return (
    <SettingsBox
      title="General email notifications"
      rightSlot={
        <>
          <ToggleRow
            checked={state.generalEmails}
            onChange={() => set("generalEmails")}
          />
        </>
      }
    >
      <ToggleRow
        title="Emails for every new user joining in team"
        description="When someone joined to your team, you'll get notified"
        checked={state.userJoined}
        onChange={set("userJoined")}
      />
      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for UI kit buying from superpage"
        description="When someone purchase your UI kit, you'll get notified"
        checked={state.kitPurchase}
        onChange={set("kitPurchase")}
      />
      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for every time new UI kit launched"
        description="When new UI kit is launched, you'll get notified"
        checked={state.kitLaunched}
        onChange={set("kitLaunched")}
      />

      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for weekly report"
        description="Every week you'll get report for your account"
        checked={state.weeklyReport}
        onChange={set("weeklyReport")}
      />

      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for every new message"
        description="When a person sends you message in superpage"
        checked={state.newMessage}
        onChange={set("newMessage")}
      />

      <div className="h-px bg-gray-200 my-2" />

      <div className="mt-4 flex items-center gap-3">
        <Button className="flex gap-2 !px-6">
          <Check />
          <span>Save Changes</span>
        </Button>
      </div>
    </SettingsBox>
  );
}
