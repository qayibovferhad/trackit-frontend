import AsyncCreatableSelect from "react-select/async-creatable";
import type { GroupBase, MultiValue } from "react-select";
import { useCallback, useRef } from "react";
import type { MemberInput, MembersOption } from "../types";
import { searchUsers } from "../services/teams.service";
import { EMAIL_REGEX } from "@/shared/constants/regex";

async function fetchEmailOptions(input: string): Promise<MembersOption[]> {
  if (!input || input.length < 2) return [];

  try {
    const data = await searchUsers(input);
    return (data?.items ?? []).map((u: any) => ({
      id: u.id,
      label: u.email,
      value: u.email,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
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

type Props = {
  value?: MemberInput[];
  onChange: (members: MemberInput[]) => void;
  placeholder?: string;
};

export default function InviteMembersInput({
  value = [],
  onChange,
  placeholder,
}: Props) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const displayValue = convertToOptions(value);

  const loadOptions = useCallback((input: string): Promise<MembersOption[]> => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        const options = await fetchEmailOptions(input);
        console.log("options", options);

        resolve(options);
      }, 500);
    });
  }, []);

  const isValidNewOption = useCallback((inputValue: string) => {
    return isValidEmail(inputValue.trim());
  }, []);

  const handleChange = useCallback(
    (selectedOptions: MultiValue<MembersOption>) => {
      const options = selectedOptions as MembersOption[];
      const members = convertToMembers(options);
      onChange(members);
    },
    [onChange]
  );
  return (
    <AsyncCreatableSelect<MembersOption, true, GroupBase<MembersOption>>
      isMulti
      cacheOptions
      defaultOptions={[]}
      loadOptions={loadOptions}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder ?? "Type an email…"}
      formatCreateLabel={(s) => `Invite "${s}"`}
      isValidNewOption={isValidNewOption}
      getNewOptionData={(inputValue) => ({
        label: inputValue,
        value: inputValue.trim(),
        role: "member" as const,
      })}
      noOptionsMessage={() => "No results"}
      onKeyDown={(e) => {
        if (e.key === "," || e.key === "Enter") {
        }
      }}
    />
  );
}
