import { useQuery } from "@tanstack/react-query";
import { getCurrentSubscriptionRequest } from "../services/subscription.service";

export const SUBSCRIPTION_QUERY_KEY = ["subscription", "current"];

export function useCurrentSubscription() {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: getCurrentSubscriptionRequest,
  });
}
