import type { WorkoutLog } from '@/types/workoutLog';

export type RecentProgressSummary = {
  currentWorkoutName?: string;
  previousWorkoutName?: string;
  currentCompletedSets: number;
  previousCompletedSets: number;
  difference: number;
};

function countCompletedSets(log?: WorkoutLog): number {
  if (!log) {
    return 0;
  }

  return log.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  );
}

export function getRecentProgressSummary(
  logs: WorkoutLog[],
): RecentProgressSummary {
  const currentWorkout = logs[0];
  const previousWorkout = logs[1];

  const currentCompletedSets = countCompletedSets(currentWorkout);
  const previousCompletedSets = countCompletedSets(previousWorkout);

  return {
    currentWorkoutName: currentWorkout?.workoutName,
    previousWorkoutName: previousWorkout?.workoutName,
    currentCompletedSets,
    previousCompletedSets,
    difference: currentCompletedSets - previousCompletedSets,
  };
}
