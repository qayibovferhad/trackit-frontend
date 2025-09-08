import { Modal } from "@/shared/ui/modal";

type InviteUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamName?: string;
};
export default function InviteUserModal({
  open,
  onOpenChange,
}: InviteUserModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Invite Members">
      <h1>salam</h1>
    </Modal>
  );
}
