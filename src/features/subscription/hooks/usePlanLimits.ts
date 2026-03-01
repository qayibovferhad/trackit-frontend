import { useCurrentSubscription } from './useCurrentSubscription';
import { getPlanLimits } from '../utils/plan-limits';

export function usePlanLimits() {
  const { data: sub } = useCurrentSubscription();
  return getPlanLimits(sub?.plan ?? 'FREE', sub?.seats ?? 3);
}
