import type { WorkoutLog } from '@/types/workoutLog';

export type StrengthProgressItem = {
  exerciseId: string;
  exerciseName: string;
  currentBestWeight?: number;
  previousBestWeight?: number;
  weightChange?: number;
  currentBestReps?: number;
  completedAt?: string;
};

const trackedExercises = [
  { id: 'back-squat', name: 'Back Squat' },
  { id: 'bench-press', name: 'Bench Press' },
  { id: 'deadlift', name: 'Deadlift' },
  { id: 'zercher-squat', name: 'Zercher Squat' },
];

function getBestWeightForExercise(
  log: WorkoutLog,
  exerciseId: string,
): {
  weight?: number;
  reps?: number;
} | undefined {
  const exercise = log.exercises.find(
    (currentExercise) => currentExercise.exerciseId === exerciseId,
  );

  if (!exercise) {
    return undefined;
  }

  const weightedSets = exercise.sets.filter(
    (set) =>
      set.completed &&
      set.weight !== undefined &&
      set.reps !== undefined,
  );

  if (weightedSets.length === 0) {
    return undefined;
  }

  const bestSet = weightedSets.reduce((best, current) => {
    if ((current.weight ?? 0) > (best.weight ?? 0)) {
      return current;
    }

    if (
      current.weight === best.weight &&
      (current.reps ?? 0) > (best.reps ?? 0)
    ) {
      return current;
    }

    return best;
  });

  return {
    weight: bestSet.weight,
    reps: bestSet.reps,
  };
}

export function getStrengthProgress(
  logs: WorkoutLog[],
): StrengthProgressItem[] {
  return trackedExercises.map((trackedExercise) => {
    const matchingPerformances = logs
      .map((log) => {
        const performance = getBestWeightForExercise(
          log,
          trackedExercise.id,
        );

        if (!performance) {
          return undefined;
        }

        return {
          ...performance,
          completedAt: log.completedAt,
        };
      })
      .filter(
        (
          performance,
        ): performance is {
          weight: number;
          reps: number;
          completedAt: string;
        } =>
          performance?.weight !== undefined &&
          performance.reps !== undefined,
      );

    const current = matchingPerformances[0];
    const previous = matchingPerformances[1];

    return {
      exerciseId: trackedExercise.id,
      exerciseName: trackedExercise.name,
      currentBestWeight: current?.weight,
      previousBestWeight: previous?.weight,
      weightChange:
        current && previous
          ? current.weight - previous.weight
          : undefined,
      currentBestReps: current?.reps,
      completedAt: current?.completedAt,
    };
  });
}
