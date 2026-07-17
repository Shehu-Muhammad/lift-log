import type { WorkoutLog } from "@/types/workoutLog";

export type PreviousPerformance = {
  exerciseId: string;
  selectedOptionId?: string;
  weight?: number;
  reps?: number;
  duration?: number;
  completedAt: string;
};

export function getPreviousPerformance(
  logs: WorkoutLog[],
  workoutId: string,
  exerciseId: string,
  selectedOptionId?: string,
): PreviousPerformance | undefined {
  const matchingLog = logs.find((log) => {
    if (log.workoutId !== workoutId) {
      return false;
    }

    const matchingExercise = log.exercises.find((exercise) => {
      if (exercise.exerciseId !== exerciseId) {
        return false;
      }

      if (selectedOptionId) {
        return exercise.selectedOptionId === selectedOptionId;
      }

      return true;
    });

    return Boolean(matchingExercise);
  });

  if (!matchingLog) {
    return undefined;
  }

  const matchingExercise = matchingLog.exercises.find((exercise) => {
    if (exercise.exerciseId !== exerciseId) {
      return false;
    }

    if (selectedOptionId) {
      return exercise.selectedOptionId === selectedOptionId;
    }

    return true;
  });

  if (!matchingExercise) {
    return undefined;
  }

  const latestCompletedSet = [...matchingExercise.sets]
    .reverse()
    .find((set) => set.completed);

  if (!latestCompletedSet) {
    return undefined;
  }

  return {
    exerciseId,
    selectedOptionId,
    weight: latestCompletedSet.weight,
    reps: latestCompletedSet.reps,
    duration: latestCompletedSet.duration,
    completedAt: matchingLog.completedAt,
  };
}
