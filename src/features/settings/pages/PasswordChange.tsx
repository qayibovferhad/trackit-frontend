import { useForm } from "react-hook-form";
import { SettingsBox } from "../components/SettingsBox";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../schemas/changePassword.schema";
import { PasswordField } from "@/features/auth/components/PasswordField";
import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";
import { useZodForm } from "@/shared/hooks/useZodForm";

export default function PasswordChange() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useZodForm(changePasswordSchema);

  async function onSubmit(data: ChangePasswordFormData) {
    console.log(data);
  }
  console.log(errors);

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
          <span>Change Password</span>
        </Button>
      </form>
    </SettingsBox>
  );
}
