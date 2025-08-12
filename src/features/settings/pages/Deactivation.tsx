import { LogOut, Trash2 } from "lucide-react";
import { SettingsBox } from "../components/SettingsBox";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function DeactivationSettings() {
  return (
    <SettingsBox title="Deactivate Account">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
            <LogOut className="size-5 text-gray-600" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              Deactivate Account
            </div>
            <p className="text-sm text-gray-600">
              You can activate your account within 30 days using your existing
              login credentials.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Trash2 className="size-5 text-gray-600" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              Delete Account Permanently
            </div>
            <p className="text-sm text-gray-600">
              You can’t re‑activate your account again; this will delete your
              account permanently.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="deactivate-reason"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            What is the reason?
            <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <Input
            id="deactivate-reason"
            placeholder="Write your reason..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none
               focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-900">
            Account Deactivate or Delete Terms
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
            <input
              type="checkbox"
              className="size-4 rounded border-gray-300 text-black focus:ring-0"
            />
            <span>
              I agree with your{" "}
              <a className="text-purple-500" target="_blank" rel="noreferrer">
                terms and conditions{" "}
              </a>
              to delete or deactivate my account
            </span>
          </label>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Deactivate Account
          </Button>

          <Button variant="destructive" type="button">
            Delete Account
          </Button>
        </div>
      </div>
    </SettingsBox>
  );
}
