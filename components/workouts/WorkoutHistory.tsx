'use client';

import { useEffect, useState } from 'react';
import { getWorkoutLogs } from '@/lib/storage/workoutLogs';
import type { WorkoutLog } from '@/types/workoutLog';
import Link from 'next/link';

export default function WorkoutHistory() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setWorkoutLogs(getWorkoutLogs());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p className='mt-8 text-slate-400'>Loading workout history...</p>;
  }

  if (workoutLogs.length === 0) {
    return (
      <div className='mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h2 className='text-lg font-semibold text-white'>
          No workouts logged yet
        </h2>

        <p className='mt-2 text-sm text-slate-400'>
          Finish a workout to see it appear here.
        </p>
      </div>
    );
  }

  return (
    <div className='mt-8 space-y-5'>
      {workoutLogs.map((log) => {
        const completedSets = log.exercises.reduce(
          (total, exercise) =>
            total + exercise.sets.filter((set) => set.completed).length,
          0,
        );

        const totalSets = log.exercises.reduce(
          (total, exercise) => total + exercise.sets.length,
          0,
        );

        return (
          <Link
            key={log.id}
            href={`/history/${log.id}`}
            className='block rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600 hover:bg-slate-800/80'
          >
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-white'>
                  {log.workoutName}
                </h2>

                <p className='mt-1 text-sm text-slate-400'>
                  {new Date(log.completedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {' at '}
                  {new Date(log.completedAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <span className='w-fit rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300'>
                {completedSets} of {totalSets} sets completed
              </span>
            </div>

            <div className='mt-5 space-y-3'>
              {log.exercises.map((exercise) => {
                const completedExerciseSets = exercise.sets.filter(
                  (set) => set.completed,
                );

                return (
                  <div
                    key={exercise.exerciseId}
                    className='rounded-lg border border-slate-800 bg-slate-950 p-4'
                  >
                    <h3 className='font-medium text-white'>
                      {exercise.exerciseName}
                    </h3>

                    <p className='mt-2 text-sm text-slate-400'>
                      {completedExerciseSets.length} completed sets
                    </p>
                  </div>
                );
              })}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
