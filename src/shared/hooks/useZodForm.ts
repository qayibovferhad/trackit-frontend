import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import type { TypeOf, ZodTypeAny } from "zod";

export function useZodForm<TSchema extends ZodTypeAny>(
  schema: TSchema,
  options?: Omit<UseFormProps<TypeOf<TSchema>>, "resolver">
) {
  return useForm<TypeOf<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });
}
