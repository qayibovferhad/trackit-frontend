import AsyncCreatableSelect from "react-select/async-creatable";
import type { GroupBase, MultiValue } from "react-select";
import { useCallback, useRef } from "react";
import AsyncSelect from "react-select/async";

export interface BaseOption {
  label: string;
  value: string;
  [key: string]: any;
}

interface GenericAsyncSelectProps<T extends BaseOption> {
  value?: T[];
  onChange: (selectedOptions: T[]) => void;
  placeholder?: string;
  loadOptions: (input: string) => Promise<T[]>;
  isValidNewOption?: (inputValue: string) => boolean;
  getNewOptionData?: (inputValue: string) => T;
  formatCreateLabel?: (inputValue: string) => string;
  noOptionsMessage?: (obj: { inputValue: string }) => string;
  debounceMs?: number;
  minInputLength?: number;
  allowCreateOption?: boolean;
}

export default function GenericAsyncSelect<T extends BaseOption>({
  value = [],
  onChange,
  placeholder = "Type to search...",
  loadOptions,
  isValidNewOption = () => true,
  getNewOptionData,
  formatCreateLabel = (s) => `Createdsds "${s}"`,
  noOptionsMessage = () => "No results",
  debounceMs = 500,
  minInputLength = 2,
  allowCreateOption = false,
}: GenericAsyncSelectProps<T>) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const debouncedLoadOptions = useCallback(
    (input: string): Promise<T[]> => {
      return new Promise((resolve) => {
        if (!input || input.length < minInputLength) {
          resolve([]);
          return;
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          try {
            const options = await loadOptions(input);
            resolve(options);
          } catch (error) {
            resolve([]);
          }
        }, debounceMs);
      });
    },
    [loadOptions, debounceMs, minInputLength]
  );

  const handleChange = useCallback(
    (selectedOptions: MultiValue<T>) => {
      const options = selectedOptions as T[];
      onChange(options);
    },
    [onChange]
  );

  const selectProps: any = {
    isMulti: true,
    cacheOptions: true,
    defaultOptions: [],
    loadOptions: debouncedLoadOptions,
    value,
    onChange: handleChange,
    placeholder,
    noOptionsMessage,
    allowCreateOption,
  };

  const commonProps: any = {
    isMulti: true,
    cacheOptions: true,
    defaultOptions: [],
    loadOptions: debouncedLoadOptions,
    value,
    onChange: handleChange,
    placeholder,
    noOptionsMessage,
  };

  if (!allowCreateOption) {
    return <AsyncSelect<T, true, GroupBase<T>> {...commonProps} />;
  }

  const creatableProps = {
    ...commonProps,
    formatCreateLabel,
    isValidNewOption,
    ...(getNewOptionData ? { getNewOptionData } : {}),
  };

  return <AsyncCreatableSelect<T, true, GroupBase<T>> {...creatableProps} />;
}
