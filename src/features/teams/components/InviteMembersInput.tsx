// components/teams/InviteMembersInput.tsx
import AsyncCreatableSelect from "react-select/async-creatable";
import type { GroupBase, MultiValue } from "react-select";
import { useCallback } from "react";
import { api } from "@/shared/lib/axios";

type Option = { label: string; value: string; id?: string }; // value: email

async function fetchEmailOptions(input: string): Promise<Option[]> {
  if (!input || input.length < 2) return [];
  const { data } = await api.get("/users/search", { params: { q: input } });
  // beklenen örnek response: [{id:"u1", email:"a@x.com", name:"Alice"}]
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
  const loadOptions = useCallback(
    (input: string) => fetchEmailOptions(input),
    []
  );

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
      // küçük UX iyileştirmeleri:
      noOptionsMessage={() => "No results"}
      // enter/comma ile eklemeyi kolaylaştır:
      onKeyDown={(e) => {
        if (e.key === "," || e.key === "Enter") {
          // react-select kendisi handle ediyor; ekstra gerek yok
        }
      }}
      // stilini shadcn'e yaklaştırmak istersen classNames prop'u ile özelleştir
    />
  );
}
