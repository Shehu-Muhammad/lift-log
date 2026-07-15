import type { WorkoutLog } from "@/types/workoutLog";

const STORAGE_KEY = "liftlog-workout-logs";

export function getWorkoutLogs(): WorkoutLog[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedLogs = window.localStorage.getItem(STORAGE_KEY);

  if (!storedLogs) {
    return [];
  }

  try {
    return JSON.parse(storedLogs) as WorkoutLog[];
  } catch {
    return [];
  }
}

export function saveWorkoutLog(workoutLog: WorkoutLog): void {
  const currentLogs = getWorkoutLogs();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([workoutLog, ...currentLogs]),
  );
}
