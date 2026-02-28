import { FormField } from "@/shared/components/FormField";
import GenericAsyncSelect from "@/shared/components/GenericAsyncSelect";
import type { FieldError } from "react-hook-form";

type TagOption = { label: string; value: string };

type Props = {
  value: TagOption[];
  onChange: (selected: TagOption[]) => void;
  error?: FieldError | any;
};

export default function TaskTagsField({ value, onChange, error }: Props) {
  return (
    <FormField label="Tags" htmlFor="tags" error={error}>
      <GenericAsyncSelect<TagOption>
        value={value}
        onChange={(opts) => onChange(opts as TagOption[])}
        placeholder="Add or select tags..."
        loadOptions={() => Promise.resolve([])}
        allowCreateOption={true}
        formatCreateLabel={(s) => `Create tag "${s}"`}
        getNewOptionData={(inputValue) => ({ label: inputValue, value: inputValue.trim() })}
        noOptionsMessage={() => "No tags"}
      />
    </FormField>
  );
}
