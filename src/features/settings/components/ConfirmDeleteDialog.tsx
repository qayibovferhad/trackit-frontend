import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useState } from "react";

type Props = {
  disabled?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
};
export default function ConfirmDeleteAccountDialog({
  disabled,
  isLoading,
  onConfirm,
}: Props) {
  const [confirmText, setConfirmText] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" disabled={disabled}>
          {isLoading ? "Deleting..." : "Delete Account"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. To confirm, type <b>DELETE</b> in the
            box below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          autoFocus
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE to confirm"
          className="mt-3"
        />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== "DELETE" || isLoading}
            onClick={() => {
              setConfirmText("");
              onConfirm();
            }}
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
