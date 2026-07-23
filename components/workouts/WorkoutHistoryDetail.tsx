'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getWorkoutLogs, deleteWorkoutLog } from '@/lib/storage/workoutLogs';
import type { WorkoutLog } from '@/types/workoutLog';

type WorkoutHistoryDetailProps = {
  logId: string;
};

export default function WorkoutHistoryDetail({
  logId,
}: WorkoutHistoryDetailProps) {
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleDelete() {
    deleteWorkoutLog(logId);
    router.push('/history');
  }

  useEffect(() => {
    const matchingLog = getWorkoutLogs().find((log) => log.id === logId);

    setWorkoutLog(matchingLog ?? null);
    setIsLoading(false);
  }, [logId]);

  if (isLoading) {
    return <p className='mt-8 text-slate-400'>Loading workout details...</p>;
  }

  if (!workoutLog) {
    return (
      <div className='mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h2 className='text-xl font-semibold text-white'>
          Workout log not found
        </h2>

        <p className='mt-2 text-sm text-slate-400'>
          This workout may have been deleted or the link may be invalid.
        </p>

        <Link
          href='/history'
          className='mt-4 inline-block rounded text-sm font-semibold text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
        >
          Back to history
        </Link>
      </div>
    );
  }

  const completedSets = workoutLog.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  );

  const totalSets = workoutLog.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  return (
    <div className='mt-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <Link
          href='/history'
          className='rounded text-sm font-semibold text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
        >
          ← Back to history
        </Link>

        <button
          type='button'
          onClick={() => setShowDeleteConfirm(true)}
          className='w-fit rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
        >
          Delete Workout
        </button>
      </div>

      <div className='mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-white'>
              {workoutLog.workoutName}
            </h2>

            <p className='mt-2 text-sm text-slate-400'>
              {new Date(workoutLog.completedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              {' at '}
              {new Date(workoutLog.completedAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          <span className='w-fit rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300'>
            {completedSets} of {totalSets} sets completed
          </span>
        </div>

        <div className='mt-6 space-y-5'>
          {workoutLog.exercises.map((exercise) => (
            <section
              key={exercise.exerciseId}
              className='rounded-lg border border-slate-800 bg-slate-950 p-4'
            >
              <h3 className='text-lg font-semibold text-white'>
                {exercise.exerciseName}
              </h3>

              <div className='mt-4 space-y-2'>
                {exercise.sets.map((set) => (
                  <div
                    key={set.setNumber}
                    className='flex flex-col gap-2 rounded-lg bg-slate-900 p-3 sm:flex-row sm:items-center sm:justify-between'
                  >
                    <span className='text-sm font-medium text-slate-300'>
                      Set {set.setNumber}
                    </span>

                    <div className='flex flex-wrap items-center gap-3 text-sm'>
                      <span className='text-slate-300'>
                        {set.duration !== undefined
                          ? `${set.duration} seconds`
                          : set.weight !== undefined
                            ? `${set.weight} lbs × ${set.reps ?? 0} reps`
                            : set.reps !== undefined
                              ? `${set.reps} reps`
                              : 'No data entered'}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          set.completed
                            ? 'bg-green-950 text-green-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {set.completed ? 'Completed' : 'Skipped'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className='mt-5 rounded-xl border border-red-900 bg-red-950/40 p-4'>
          <h3 className='font-semibold text-white'>Delete this workout?</h3>

          <p className='mt-2 text-sm text-red-200'>
            This will permanently remove the workout from your history.
          </p>

          <div className='mt-4 flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={handleDelete}
              className='rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            >
              Yes, delete
            </button>

            <button
              type='button'
              onClick={() => setShowDeleteConfirm(false)}
              className='rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
