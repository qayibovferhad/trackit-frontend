import { useEffect, useState } from "react";
import type { NotificationSettingsType } from "../types";
import { SettingsBox } from "../components/SettingsBox";
import { ToggleRow } from "../components/ToggleRow";
import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "../services/settings.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorAlert } from "@/shared/components/ErrorAlert";

export default function NotificationSettings() {
  const queryClient = useQueryClient();

  const {
    data: initialSettings,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: getNotificationSettings,
  });

  const [settings, setSettings] = useState<NotificationSettingsType>({
    generalEmails: true,
    userJoined: true,
    kitPurchase: true,
    kitLaunched: true,
    weeklyReport: true,
    newMessage: true,
  });

  useEffect(() => {
    if (initialSettings) setSettings(initialSettings);
  }, [initialSettings]);

  const toggleSetting =
    (key: keyof NotificationSettingsType) => (value: boolean) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const {
    mutateAsync,
    isPending,
    error: updateError,
  } = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["notification-settings"], updatedSettings);
    },
  });

  const handleSave = async () => {
    await mutateAsync(settings);
  };

  if (isLoading) {
    return (
      <SettingsBox title="General email notifications">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </SettingsBox>
    );
  }

  if (fetchError) {
    return (
      <SettingsBox title="General email notifications">
        <ErrorAlert message="Failed to load notification settings" />
      </SettingsBox>
    );
  }

  return (
    <SettingsBox
      title="General email notifications"
      rightSlot={
        <>
          <ToggleRow
            checked={settings.generalEmails}
            onChange={toggleSetting("generalEmails")}
          />
        </>
      }
    >
      <ToggleRow
        title="Emails for every new user joining in team"
        description="When someone joined to your team, you'll get notified"
        checked={settings.userJoined}
        onChange={toggleSetting("userJoined")}
      />
      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for UI kit buying from superpage"
        description="When someone purchase your UI kit, you'll get notified"
        checked={settings.kitPurchase}
        onChange={toggleSetting("kitPurchase")}
      />
      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for every time new UI kit launched"
        description="When new UI kit is launched, you'll get notified"
        checked={settings.kitLaunched}
        onChange={toggleSetting("kitLaunched")}
      />

      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for weekly report"
        description="Every week you'll get report for your account"
        checked={settings.weeklyReport}
        onChange={toggleSetting("weeklyReport")}
      />

      <div className="h-px bg-gray-200 my-2" />

      <ToggleRow
        title="Emails for every new message"
        description="When a person sends you message in superpage"
        checked={settings.newMessage}
        onChange={toggleSetting("newMessage")}
      />

      <div className="h-px bg-gray-200 my-2" />

      <div className="mt-4 flex items-center gap-3">
        <Button
          className="flex gap-2 !px-6"
          onClick={handleSave}
          disabled={isPending}
        >
          <Check />
          <span>{isPending ? "Saving..." : "Save Changes"}</span>
        </Button>
        {updateError && (
          <ErrorAlert
            message={updateError?.message || "Failed to save settings"}
          />
        )}
      </div>
    </SettingsBox>
  );
}
