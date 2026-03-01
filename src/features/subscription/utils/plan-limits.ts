export function getPlanLimits(plan: string, seats: number) {
  if (plan === 'STARTER') {
    return {
      maxBoards: 5 + Math.floor((seats - 20) / 10),
      maxMembers: seats,
    };
  }
  if (plan === 'PREMIUM') {
    return {
      maxBoards: seats >= 250 ? Infinity : 25 + Math.floor((seats - 20) / 8),
      maxMembers: seats,
    };
  }
  // FREE + fallback
  return { maxBoards: 1, maxMembers: 3 };
}
