import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchEligibleUsersInfinite,
  inviteUser,
} from "../services/teams.service";
import type { Page } from "../types";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { useMemo } from "react";
import UserAvatar from "@/shared/components/UserAvatar";

type InviteUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamName?: string;
};

export default function InviteUserModal({
  open,
  onOpenChange,
  teamId,
}: InviteUserModalProps) {
  const take = 20;

  const { data, isLoading, isError } = useInfiniteQuery<
    Page,
    Error,
    { pages: Page[]; pageParams: (string | null)[] },
    [string, string, number],
    string | null
  >({
    queryKey: ["eligible-users", teamId, take],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      fetchEligibleUsersInfinite(teamId, {
        cursor: pageParam ?? null,
        take,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: open && !!teamId,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
  });

  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Invite Members">
      <div className="max-h-[440px] overflow-auto pr-1">
        {isLoading ? (
          <div className="p-3 text-sm text-muted-foreground">
            Loading users…
          </div>
        ) : isError ? (
          <ErrorAlert message="Failed to load users." />
        ) : allItems.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">
            No eligible users.
          </div>
        ) : (
          <ul className="divide-y">
            {allItems.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={u.name || u.email}
                    src={u.profileImage}
                    size="lg"
                  />
                  <div className="leading-tight">
                    <div className="font-medium">{u.name || u.email}</div>
                    {u.name && (
                      <div className="text-xs text-muted-foreground">
                        {u.email}
                      </div>
                    )}
                  </div>
                </div>
                <InviteButton teamId={teamId} userId={u.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

function InviteButton({ teamId, userId }: { teamId: string; userId: string }) {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => inviteUser(teamId, userId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["eligible-users", teamId],
      });
      qc.invalidateQueries({
        queryKey: ["my-invites-count"],
      });
      console.log("salaaam");
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate()}
      className="disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "Inviting..." : "Invite"}
    </Button>
  );
}
