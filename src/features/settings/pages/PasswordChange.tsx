import { SettingsBox } from "../components/SettingsBox";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../schemas/changePassword.schema";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { useMutation } from "@tanstack/react-query";
import { changePasswordRequest } from "../services/settings.service";
import { ErrorAlert } from "@/shared/components/ErrorAlert";

export default function PasswordChangeSettings() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useZodForm(changePasswordSchema, {
    defaultValues: {
      newPassword: "",
      currentPassword: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: () => {},
  });
  async function onSubmit(data: ChangePasswordFormData) {
    await mutateAsync(data);
  }

  return (
    <SettingsBox title="Password Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <PasswordField
          label="Current Password"
          error={errors.currentPassword}
          registration={register("currentPassword")}
        />
        <PasswordField
          label="New Password"
          error={errors.newPassword}
          registration={register("newPassword")}
        />
        <PasswordField
          label="Re-type Password"
          error={errors.confirmPassword}
          registration={register("confirmPassword")}
        />
        <Button type="submit" className="cursor-pointer flex gap-2 px-[30px]">
          <Check />
          <span>{isPending ? "Changing..." : "Change Password"}</span>
        </Button>
        {error && <ErrorAlert message={error?.message} />}
      </form>
    </SettingsBox>
  );
}
