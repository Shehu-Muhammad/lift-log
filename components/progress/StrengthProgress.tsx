'use client';

import { useEffect, useState } from 'react';
import { getWorkoutLogs } from '@/lib/storage/workoutLogs';
import {
  getStrengthProgress,
  type StrengthProgressItem,
} from '@/lib/workouts/strengthProgress';

export default function StrengthProgress() {
  const [items, setItems] = useState<StrengthProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setItems(getStrengthProgress(getWorkoutLogs()));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p className='mt-5 text-sm text-slate-400'>Loading strength data...</p>;
  }

  return (
    <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
      <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
        Strength progress
      </p>

      <h2 className='mt-2 text-2xl font-bold text-white'>
        Major lifts
      </h2>

      <div className='mt-6 grid gap-4 sm:grid-cols-2'>
        {items.map((item) => (
          <article
            key={item.exerciseId}
            className='rounded-lg border border-slate-800 bg-slate-950 p-4'
          >
            <div className='flex items-start justify-between gap-3'>
              <div>
                <h3 className='font-semibold text-white'>
                  {item.exerciseName}
                </h3>

                {item.currentBestWeight !== undefined ? (
                  <>
                    <p className='mt-2 text-2xl font-bold text-white'>
                      {item.currentBestWeight} lbs
                    </p>

                    <p className='mt-1 text-sm text-slate-400'>
                      {item.currentBestReps ?? 0} reps
                    </p>
                  </>
                ) : (
                  <p className='mt-2 text-sm text-slate-400'>
                    No completed weighted sets yet.
                  </p>
                )}
              </div>

              {item.weightChange !== undefined && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.weightChange > 0
                      ? 'bg-green-950 text-green-300'
                      : item.weightChange < 0
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.weightChange > 0
                    ? `+${item.weightChange} lbs`
                    : item.weightChange < 0
                      ? `${item.weightChange} lbs`
                      : 'No change'}
                </span>
              )}
            </div>

            {item.completedAt && (
              <p className='mt-3 text-xs text-slate-500'>
                Latest: {' '}
                {new Date(item.completedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
