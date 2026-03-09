import AsyncCreatableSelect from "react-select/async-creatable";
import type { GroupBase, MultiValue, SingleValue } from "react-select";
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
  isDisabled?: boolean;
  isMulti?: boolean;
}

const EMPTY_ARRAY: BaseOption[] = [];

export default function GenericAsyncSelect<T extends BaseOption>({
  value = EMPTY_ARRAY as T[],
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
  isDisabled = false,
  isMulti = true,
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
    (selected: MultiValue<T> | SingleValue<T>) => {
      if (isMulti) {
        onChange((selected as MultiValue<T>) as T[]);
      } else {
        onChange(selected ? [selected as T] : []);
      }
    },
    [onChange, isMulti]
  );

  const selectValue = isMulti ? value : (value?.[0] ?? null);

  const commonProps: any = {
    isMulti,
    cacheOptions: true,
    defaultOptions: [],
    loadOptions: debouncedLoadOptions,
    value: selectValue,
    onChange: handleChange,
    placeholder,
    noOptionsMessage,
    isDisabled,
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
