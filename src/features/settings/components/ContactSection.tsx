import { FormField } from "@/shared/components/FormField";
import { SettingsBox } from "./SettingsBox";
import { Button } from "@/shared/ui/button";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateEmail, updatePhone } from "../services/settings.service";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { useZodForm } from "@/shared/hooks/useZodForm";
import {
  emailUpdateSchema,
  phoneUpdateSchema,
  type EmailUpdateFormData,
  type PhoneUpdateFormData,
} from "../schemas/personalDetails.schema";

interface ContactSectionProps {
  data: any;
  refetch: () => void;
}
export default function ContactSection({ data, refetch }: ContactSectionProps) {
  const {
    register: registerEmail,
    formState: { errors: emailErrors },
    handleSubmit: handleEmailSubmit,
    setValue: setEmailFormValue,
  } = useZodForm(emailUpdateSchema, {
    defaultValues: {
      email: data?.email || "",
    },
  });

  const {
    register: registerPhone,
    formState: { errors: phoneErrors },
    handleSubmit: handlePhoneSubmit,
    setValue: setPhoneFormValue,
  } = useZodForm(phoneUpdateSchema, {
    defaultValues: {
      phone: data?.phone || "",
    },
  });

  useEffect(() => {
    if (data) {
      setEmailFormValue("email", data.email || "");
      setPhoneFormValue("phone", data.phone || "");
    }
  }, [data, setEmailFormValue, setPhoneFormValue]);

  const {
    mutateAsync: updateEmailMutation,
    isPending: isUpdatingEmail,
    error: emailUpdateError,
  } = useMutation({
    mutationFn: updateEmail,
    onSuccess: () => {
      refetch();
    },
  });

  const {
    mutateAsync: updatePhoneMutation,
    isPending: isUpdatingPhone,
    error: phoneUpdateError,
  } = useMutation({
    mutationFn: updatePhone,
    onSuccess: () => {
      refetch();
    },
  });

  const handleEmailUpdate = async (data: EmailUpdateFormData) => {
    await updateEmailMutation(data);
  };

  const handlePhoneUpdate = async (data: PhoneUpdateFormData) => {
    await updatePhoneMutation(data);
  };
  return (
    <SettingsBox title="Email and Phone Details">
      <div className="space-y-4">
        <div>
          <form onSubmit={handleEmailSubmit(handleEmailUpdate)}>
            <FormField
              label="Email Address"
              error={emailErrors.email}
              htmlFor="email"
            >
              <div className="flex gap-3">
                <input
                  id="email"
                  type="email"
                  {...registerEmail("email")}
                  className="w-90 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  type="submit"
                  {...registerEmail("email")}
                  disabled={isUpdatingEmail}
                  className="px-4"
                >
                  {isUpdatingEmail ? "Updating..." : "Update"}
                </Button>
              </div>
            </FormField>
          </form>
          {emailUpdateError && (
            <div className="mt-2">
              <ErrorAlert
                message={emailUpdateError?.message || "Failed to update email"}
              />
            </div>
          )}
        </div>
        <div>
          <form onSubmit={handlePhoneSubmit(handlePhoneUpdate)}>
            <FormField
              label="Phone Number"
              error={phoneErrors.phone}
              htmlFor="phone"
            >
              <div className="flex gap-3">
                <input
                  id="phone"
                  type="tel"
                  {...registerPhone("phone")}
                  placeholder="+1234567890"
                  className="w-90 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  type="submit"
                  disabled={isUpdatingPhone}
                  className="px-4"
                >
                  {isUpdatingPhone ? "Updating..." : "Update"}
                </Button>
              </div>
            </FormField>
          </form>
          {phoneUpdateError && (
            <div className="mt-2">
              <ErrorAlert
                message={phoneUpdateError?.message || "Failed to update phone"}
              />
            </div>
          )}
        </div>
      </div>
    </SettingsBox>
  );
}
