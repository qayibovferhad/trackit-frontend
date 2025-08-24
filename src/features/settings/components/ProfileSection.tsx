import { Button } from "@/shared/ui/button";
import { SettingsBox } from "./SettingsBox";
import { Check, Upload, User } from "lucide-react";
import { FormField } from "@/shared/components/FormField";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  updatePersonalDetails,
  uploadProfileImage,
} from "../services/settings.service";
import {
  profileDetailsSchema,
  type ProfileDetailsFormData,
} from "../schemas/personalDetails.schema";
import { useZodForm } from "@/shared/hooks/useZodForm";
import type { PersonalDetails } from "../types";
import { getErrorMessage } from "@/shared/lib/error";

interface ProfileSectionProps {
  data: PersonalDetails;
  isLoading: boolean;
  refetch: () => void;
}

export default function ProfileSection({ data, refetch }: ProfileSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadImage, isPending: isUploadingImage } = useMutation(
    {
      mutationFn: uploadProfileImage,
      onSuccess: (imageUrl) => {
        setImagePreview(imageUrl);
        refetch();
      },
    }
  );

  const {
    mutateAsync: updateDetails,
    isPending: isUpdatingDetails,
    error: updateError,
  } = useMutation({
    mutationFn: updatePersonalDetails,
    onSuccess: () => {
      refetch();
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useZodForm(profileDetailsSchema, {
    defaultValues: {
      name: data?.name || "",
      username: data?.username || "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name || "");
      setValue("username", data.username || "");
    }
  }, [data, setValue]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      await uploadImage(formData);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileDetailsFormData) => {
    await updateDetails(data);
  };

  return (
    <SettingsBox title="Personal Details">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : data?.profileImage ? (
                <img
                  src={data.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={24} />
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={triggerImageUpload}
            disabled={isUploadingImage}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            {isUploadingImage ? "Uploading..." : "Upload Profile Image"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" error={errors.name} htmlFor="name">
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </FormField>
            <FormField
              label="Username"
              error={errors.username}
              htmlFor="username"
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-500 text-sm">
                  Trackit/
                </span>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </FormField>
          </div>
          <div className="bg-gray-200 p-3 rounded-lg">
            <p className="text-sm text-gray-500">
              <strong>Note:</strong> You can change username 24days once. So
              check the username before you process.
            </p>
          </div>
          <Button
            type="submit"
            disabled={isUpdatingDetails}
            className="flex items-center gap-2 px-6"
          >
            <Check size={16} />
            {isUpdatingDetails ? "Saving Changes..." : "Save Changes"}
          </Button>
          {updateError && <ErrorAlert message={getErrorMessage(updateError)} />}
        </form>
      </div>
    </SettingsBox>
  );
}
