import AsyncCreatableSelect from "react-select/async-creatable";
import type { GroupBase, MultiValue } from "react-select";
import { useCallback, useRef } from "react";
import type { MembersOption } from "../types";
import { searchUsers } from "../services/teams.service";

async function fetchEmailOptions(input: string): Promise<MembersOption[]> {
  if (!input || input.length < 2) return [];
  const data = await searchUsers(input);
  return (data?.items ?? []).map((u: any) => ({
    id: u.id,
    label: u.email,
    value: u.email,
  }));
}

type Props = {
  value?: MembersOption[];
  onChange: (opts: MembersOption[]) => void;
  placeholder?: string;
};

export default function InviteMembersInput({
  value,
  onChange,
  placeholder,
}: Props) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const loadOptions = useCallback((input: string): Promise<MembersOption[]> => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        const options = await fetchEmailOptions(input);
        resolve(options);
      }, 500);
    });
  }, []);

  return (
    <AsyncCreatableSelect<MembersOption, true, GroupBase<MembersOption>>
      isMulti
      cacheOptions
      defaultOptions={[]}
      loadOptions={loadOptions}
      value={value}
      onChange={(v: MultiValue<MembersOption>) =>
        onChange(v as MembersOption[])
      }
      placeholder={placeholder ?? "Type an email…"}
      formatCreateLabel={(s) => `Invite "${s}"`}
      noOptionsMessage={() => "No results"}
      onKeyDown={(e) => {
        if (e.key === "," || e.key === "Enter") {
        }
      }}
    />
  );
}
