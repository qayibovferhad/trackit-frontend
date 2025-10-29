import { Modal } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvite,
  declineInvite,
  fetchMyInvites,
} from "../services/teams.service";

type InvitesModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInviteAction: () => void;
};

export default function InvitesModal({
  open,
  onOpenChange,
  onInviteAction,
}: InvitesModalProps) {
  const qc = useQueryClient();

  const {
    data = { invites: [], joinRequests: [] },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-invites"],
    queryFn: fetchMyInvites,
    enabled: open,
    refetchOnWindowFocus: false,
  });

  const acceptMut = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-invites"] });
      qc.invalidateQueries({ queryKey: ["teams"] });
      onInviteAction();
    },
  });

  const declineMut = useMutation({
    mutationFn: declineInvite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-invites"] });
      onInviteAction();
    },
  });

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Pending Invites">
      <div className="space-y-3">
        {isLoading && <p>Loading invites…</p>}
        {isError && <ErrorAlert message="Failed to load invites" />}

        {!isLoading && !isError && data.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">No incoming invites.</p>
        )}

        <ul className="space-y-2">
          {data?.invites.map((inv: any) => (
            <li
              key={inv.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {inv.team?.name ?? "Team"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Requested by: <span className="font-medium">{inv.inviter?.username || inv.inviter?.name}</span>
                  {inv.expiresAt && (
                    <> • Expires: {new Date(inv.expiresAt).toLocaleString()}</>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => acceptMut.mutate(inv.token)}
                  disabled={acceptMut.isPending}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => declineMut.mutate(inv.token)}
                  disabled={declineMut.isPending}
                >
                  Decline
                </Button>
              </div>
            </li>
          ))}

          {data.joinRequests.length > 0 && (
          <>
            <h3 className="text-sm font-semibold">Join Requests</h3>
            <ul className="space-y-2">
              {data.joinRequests.map((req: any) => (
                <li key={req.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{req.team?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Requested by: <span className="font-medium">{req.requester?.username || req.requester?.name}</span>
                      {req.expiresAt && <> • Expires: {new Date(req.expiresAt).toLocaleString()}</>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => acceptMut.mutate(req.token)} disabled={acceptMut.isPending}>
                   Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => declineMut.mutate(req.token)} disabled={declineMut.isPending}>
                      Decline
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        </ul>
      </div>
    </Modal>
  );
}
