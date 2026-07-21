import type { BodyWeightEntry } from '@/types/bodyWeight';

const BODY_WEIGHT_LOGS_KEY = 'liftlog-body-weight-logs';
const TARGET_WEIGHT_KEY = 'liftlog-target-weight';

export function getBodyWeightLogs(): BodyWeightEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedLogs = window.localStorage.getItem(BODY_WEIGHT_LOGS_KEY);

  if (!storedLogs) {
    return [];
  }

  try {
    return JSON.parse(storedLogs) as BodyWeightEntry[];
  } catch {
    return [];
  }
}

export function saveBodyWeightEntry(entry: BodyWeightEntry): void {
  const currentLogs = getBodyWeightLogs();

  const updatedLogs = [
    entry,
    ...currentLogs.filter((item) => item.date !== entry.date),
  ].sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime(),
  );

  window.localStorage.setItem(
    BODY_WEIGHT_LOGS_KEY,
    JSON.stringify(updatedLogs),
  );
}

export function deleteBodyWeightEntry(entryId: string): void {
  const updatedLogs = getBodyWeightLogs().filter(
    (entry) => entry.id !== entryId,
  );

  window.localStorage.setItem(
    BODY_WEIGHT_LOGS_KEY,
    JSON.stringify(updatedLogs),
  );
}

export function getTargetWeight(): number {
  if (typeof window === 'undefined') {
    return 215;
  }

  const storedTarget = window.localStorage.getItem(TARGET_WEIGHT_KEY);

  if (!storedTarget) {
    return 215;
  }

  const parsedTarget = Number(storedTarget);

  return Number.isFinite(parsedTarget) ? parsedTarget : 215;
}

export function saveTargetWeight(weight: number): void {
  window.localStorage.setItem(
    TARGET_WEIGHT_KEY,
    String(weight),
  );
}
