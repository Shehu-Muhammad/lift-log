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
  } catch (error) {
    console.error("Could not parse workout logs:", error);
    return [];
  }
}

export function saveWorkoutLog(workoutLog: WorkoutLog): void {
  if (typeof window === "undefined") {
    console.error("localStorage is unavailable");
    return;
  }

  const currentLogs = getWorkoutLogs();
  const updatedLogs = [workoutLog, ...currentLogs];

  console.log("Saving workout logs:", updatedLogs);

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedLogs),
  );

  console.log(
    "Saved localStorage value:",
    window.localStorage.getItem(STORAGE_KEY),
  );
}

export function deleteWorkoutLog(logId: string): void {
  const updatedLogs = getWorkoutLogs().filter((log) => log.id !== logId);

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedLogs),
  );
}