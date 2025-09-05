import AsyncCreatableSelect from "react-select/async-creatable";
import type { GroupBase, MultiValue } from "react-select";
import { useCallback, useRef } from "react";
import { api } from "@/shared/lib/axios";

type Option = { label: string; value: string; id?: string }; // value: email

async function fetchEmailOptions(input: string): Promise<Option[]> {
  if (!input || input.length < 2) return [];
  const { data } = await api.get("/users/search", { params: { q: input } });
  return (data?.items ?? []).map((u: any) => ({
    id: u.id,
    label: u.email,
    value: u.email,
  }));
}

type Props = {
  value?: Option[];
  onChange: (opts: Option[]) => void;
  placeholder?: string;
};

export default function InviteMembersInput({
  value,
  onChange,
  placeholder,
}: Props) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const loadOptions = useCallback((input: string): Promise<Option[]> => {
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
    <AsyncCreatableSelect<Option, true, GroupBase<Option>>
      isMulti
      cacheOptions
      defaultOptions={[]}
      loadOptions={loadOptions}
      value={value}
      onChange={(v: MultiValue<Option>) => onChange(v as Option[])}
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
