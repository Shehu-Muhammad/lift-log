import type { WorkoutLog } from '@/types/workoutLog';

export type DashboardStats = {
  totalWorkouts: number;
  completedSetsThisWeek: number;
  latestWorkout?: WorkoutLog;
  nextWorkoutId: 'day-1' | 'day-2';
  nextWorkoutName: 'Day 1' | 'Day 2';
};

function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + difference);
  start.setHours(0, 0, 0, 0);

  return start;
}

export function getDashboardStats(logs: WorkoutLog[]): DashboardStats {
  const latestWorkout = logs[0];

  const startOfWeek = getStartOfWeek(new Date());

  const completedSetsThisWeek = logs
    .filter((log) => new Date(log.completedAt) >= startOfWeek)
    .reduce(
      (workoutTotal, log) =>
        workoutTotal +
        log.exercises.reduce(
          (exerciseTotal, exercise) =>
            exerciseTotal +
            exercise.sets.filter((set) => set.completed).length,
          0,
        ),
      0,
    );

  const nextWorkoutId =
    latestWorkout?.workoutId === 'day-1' ? 'day-2' : 'day-1';

  const nextWorkoutName =
    nextWorkoutId === 'day-1' ? 'Day 1' : 'Day 2';

  return {
    totalWorkouts: logs.length,
    completedSetsThisWeek,
    latestWorkout,
    nextWorkoutId,
    nextWorkoutName,
  };
}
