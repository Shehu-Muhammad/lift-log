import type { LoggedSet, WorkoutLog } from "@/types/workoutLog";

export type PreviousPerformance = {
  exerciseId: string;
  selectedOptionId?: string;
  sets: LoggedSet[];
  completedAt: string;
};

export function getPreviousPerformance(
  logs: WorkoutLog[],
  workoutId: string,
  exerciseId: string,
  selectedOptionId?: string,
): PreviousPerformance | undefined {
  for (const log of logs) {
    if (log.workoutId !== workoutId) {
      continue;
    }

    const matchingExercise = log.exercises.find((exercise) => {
      if (exercise.exerciseId !== exerciseId) {
        return false;
      }

      if (selectedOptionId) {
        return exercise.selectedOptionId === selectedOptionId;
      }

      return !exercise.selectedOptionId;
    });

    if (!matchingExercise) {
      continue;
    }

    const hasCompletedSet = matchingExercise.sets.some(
      (set) => set.completed,
    );

    if (!hasCompletedSet) {
      continue;
    }

    return {
      exerciseId,
      selectedOptionId,
      sets: matchingExercise.sets,
      completedAt: log.completedAt,
    };
  }

  return undefined;
}