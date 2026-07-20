import type { FoodLogEntry } from '@/types/food';

const FOOD_LOGS_KEY = 'liftlog-food-logs';

export function getFoodLogs(): FoodLogEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedLogs = window.localStorage.getItem(FOOD_LOGS_KEY);

  if (!storedLogs) {
    return [];
  }

  try {
    return JSON.parse(storedLogs) as FoodLogEntry[];
  } catch {
    return [];
  }
}

export function saveFoodLogEntry(entry: FoodLogEntry): void {
  const currentLogs = getFoodLogs();

  window.localStorage.setItem(
    FOOD_LOGS_KEY,
    JSON.stringify([entry, ...currentLogs]),
  );
}

export function deleteFoodLogEntry(entryId: string): void {
  const updatedLogs = getFoodLogs().filter((entry) => entry.id !== entryId);

  window.localStorage.setItem(
    FOOD_LOGS_KEY,
    JSON.stringify(updatedLogs),
  );
}

export function getFoodLogsByDate(date: string): FoodLogEntry[] {
  return getFoodLogs().filter((entry) => entry.date === date);
}