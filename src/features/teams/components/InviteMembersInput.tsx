import { EMAIL_REGEX } from "@/shared/constants/regex";
import { searchUsers } from "../services/teams.service";
import type { MemberInput, MembersOption } from "../types";
import { useCallback } from "react";
import GenericAsyncSelect from "@/shared/components/GenericAsyncSelect";

async function fetchEmailOptions(input: string): Promise<MembersOption[]> {
  if (!input || input.length < 2) return [];

  try {
    const data = await searchUsers(input);
    return (data?.items ?? []).map((u: any) => ({
      id: u.id,
      label: u.email,
      value: u.email,
      role: "member" as const,
    }));
  } catch (error) {
    return [];
  }
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function convertToMembers(options: MembersOption[]): MemberInput[] {
  return options
    .filter((opt) => isValidEmail(opt.value))
    .map((opt) => ({
      email: opt.value,
      role: opt.role || ("member" as const),
    }));
}

function convertToOptions(members: MemberInput[]): MembersOption[] {
  return members.map((member) => ({
    label: member.email,
    value: member.email,
    role: member.role,
  }));
}

interface InviteMembersInputProps {
  value?: MemberInput[];
  onChange: (members: MemberInput[]) => void;
  placeholder?: string;
}

export default function InviteMembersInput({
  value = [],
  onChange,
  placeholder,
}: InviteMembersInputProps) {
  const displayValue = convertToOptions(value);

  const handleMembersChange = useCallback(
    (selectedOptions: MembersOption[]) => {
      const members = convertToMembers(selectedOptions);

      onChange(members);
    },
    [onChange]
  );

  return (
    <GenericAsyncSelect<MembersOption>
      value={displayValue}
      onChange={handleMembersChange}
      placeholder={placeholder ?? "Type an email…"}
      loadOptions={fetchEmailOptions}
      isValidNewOption={(inputValue) => isValidEmail(inputValue.trim())}
      getNewOptionData={(inputValue) => ({
        label: inputValue,
        value: inputValue.trim(),
        role: "member" as const,
      })}
      formatCreateLabel={(s) => `Invite "${s}"`}
      allowCreateOption={true}
    />
  );
}
