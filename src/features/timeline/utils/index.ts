import { CARD_GAP, CARD_H, ROW_PAD } from "../constants";
import type { TimelineTask } from "../types/timeline.types";

export function rowHeight(lanes: number): number {
  return ROW_PAD * 2 + lanes * (CARD_H + CARD_GAP) - CARD_GAP;
}

export function cardTop(lane: number): number {
  return ROW_PAD + lane * (CARD_H + CARD_GAP);
}

export function assignLanes(tasks: TimelineTask[]): {
  laneMap: Map<string, number>;
  laneCount: number;
} {
  const sorted = [...tasks].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
  const laneEnds: Date[] = [];
  const laneMap = new Map<string, number>();

  for (const task of sorted) {
    let lane = laneEnds.findIndex((end) => end <= task.startDate);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = task.dueAt;
    laneMap.set(task.id, lane);
  }

  return { laneMap, laneCount: laneEnds.length };
}
