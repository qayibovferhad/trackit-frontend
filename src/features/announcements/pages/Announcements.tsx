import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Plus } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/shared/ui/button";
import AnnouncementCard from "../components/AnnouncementCard";
import AnnouncementModal from "../components/AnnouncementModal";
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  updateAnnouncement,
} from "../services/announcements.service";
import type { Announcement, CreateAnnouncementPayload } from "../types";
import type { AnnouncementFormData } from "../schemas/announcement.schema";

export default function Announcements() {
  const queryClient = useQueryClient();
  const user = useUserStore((s) => s.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);

  useEffect(() => {
    document.title = "Announcements";
  }, []);

  const { data = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setModalOpen(false);
      toast.success("Announcement created");
    },
    onError: () => toast.error("Failed to create announcement"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateAnnouncementPayload }) =>
      updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setEditTarget(null);
      setModalOpen(false);
      toast.success("Announcement updated");
    },
    onError: () => toast.error("Failed to update announcement"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deleted");
    },
    onError: () => toast.error("Failed to delete announcement"),
  });

  function handleSubmit(data: AnnouncementFormData) {
    const payload: CreateAnnouncementPayload = {
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      teamId: data.isPublic ? undefined : data.teamId || undefined,
    };
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="px-6 py-6">
      <div className="mx-auto max-w-3xl rounded-xl border bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-violet-600" />
              <span className="text-base font-semibold">Announcements</span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              From personal and team project
            </p>
          </div>

          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              setEditTarget(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-1 p-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No announcements yet.
          </div>
        ) : (
          <ul className="divide-y">
            {data.map((item) => (
              <AnnouncementCard
                key={item.id}
                item={item}
                currentUserId={user?.id ?? ""}
                onDelete={(id) => deleteMutation.mutate(id)}
                onEdit={(a) => {
                  setEditTarget(a);
                  setModalOpen(true);
                }}
              />
            ))}
          </ul>
        )}
      </div>

      <AnnouncementModal
        open={modalOpen || editTarget !== null}
        onOpenChange={(v) => {
          if (!v) {
            setModalOpen(false);
            setEditTarget(null);
          }
        }}
        mode={editTarget ? "edit" : "create"}
        initial={editTarget}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />
    </div>
  );
}
