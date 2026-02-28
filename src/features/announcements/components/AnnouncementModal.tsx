import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/shared/ui/modal";
import { InputField } from "@/shared/components/InputField";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { fetchTeams } from "@/features/teams/services/teams.service";
import {
  announcementSchema,
  type AnnouncementFormData,
} from "../schemas/announcement.schema";
import type { Announcement } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: Announcement | null;
  onSubmit: (data: AnnouncementFormData) => void;
  isLoading?: boolean;
};

export default function AnnouncementModal({
  open,
  onOpenChange,
  mode,
  initial,
  onSubmit,
  isLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useZodForm(announcementSchema);

  const isPublic = watch("isPublic");

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset({
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        teamId: initial?.teamId ?? "",
        isPublic: initial?.isPublic ?? false,
      });
    } else {
      reset({ title: "", description: "", teamId: "", isPublic: false });
    }
  }, [open, initial, reset]);

  const title = mode === "create" ? "New Announcement" : "Edit Announcement";
  const submitLabel = mode === "create" ? "Create" : "Save changes";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="announcement-form"
            variant="soft"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : submitLabel}
          </Button>
        </div>
      }
    >
      <form
        id="announcement-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <InputField
          label="Title"
          htmlFor="title"
          register={register}
          error={errors.title}
          placeholder="Announcement title..."
        />

        <FormField label="Description" error={errors.description} htmlFor="description">
          <textarea
            id="description"
            {...register("description")}
            placeholder="Write your announcement..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none"
          />
        </FormField>

        <FormField htmlFor="isPublic">
          <div className="flex items-center gap-2">
            <input
              id="isPublic"
              type="checkbox"
              {...register("isPublic")}
              onChange={(e) => {
                setValue("isPublic", e.target.checked);
                if (e.target.checked) setValue("teamId", "");
              }}
              className="h-4 w-4 rounded accent-violet-600"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make public (visible to everyone)
            </label>
          </div>
        </FormField>

        {!isPublic && (
          <FormField label="Team" htmlFor="teamId">
            <select
              id="teamId"
              {...register("teamId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none"
            >
              <option value="">— Personal (only you) —</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormField>
        )}
      </form>
    </Modal>
  );
}
