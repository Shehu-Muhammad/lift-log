'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getWorkoutLogs } from '@/lib/storage/workoutLogs';
import {
  getDashboardStats,
  type DashboardStats,
} from '@/lib/workouts/dashboardStats';
import {
  getRecentProgressSummary,
  type RecentProgressSummary,
} from '@/lib/workouts/recentProgress';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProgress, setRecentProgress] =
    useState<RecentProgressSummary | null>(null);

  useEffect(() => {
    const logs = getWorkoutLogs();
    setStats(getDashboardStats(logs));
    setRecentProgress(getRecentProgressSummary(logs));
  }, []);

  if (!stats) {
    return <p className='mt-8 text-slate-400'>Loading dashboard...</p>;
  }

  return (
    <div className='mt-8 space-y-8'>
      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <article className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
          <p className='text-sm text-slate-400'>Total workouts</p>

          <p className='mt-2 text-3xl font-bold text-white'>
            {stats.totalWorkouts}
          </p>
        </article>

        <article className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
          <p className='text-sm text-slate-400'>Completed sets this week</p>

          <p className='mt-2 text-3xl font-bold text-white'>
            {stats.completedSetsThisWeek}
          </p>
        </article>

        <article className='rounded-xl border border-slate-800 bg-slate-900 p-5 sm:col-span-2 lg:col-span-1'>
          <p className='text-sm text-slate-400'>Next workout</p>

          <p className='mt-2 text-3xl font-bold text-white'>
            {stats.nextWorkoutName}
          </p>
        </article>
      </section>

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-blue-400'>
          Recommended next
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>
          Start {stats.nextWorkoutName}
        </h2>

        <p className='mt-2 text-sm text-slate-400'>
          Based on your most recently saved workout, this is the next routine in
          your two-day rotation.
        </p>

        <Link
          href={`/workouts/${stats.nextWorkoutId}`}
          className='mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
        >
          Start {stats.nextWorkoutName}
        </Link>
      </section>

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
              Most recent workout
            </p>

            {stats.latestWorkout ? (
              <>
                <h2 className='mt-2 text-xl font-semibold text-white'>
                  {stats.latestWorkout.workoutName}
                </h2>

                <p className='mt-1 text-sm text-slate-400'>
                  {new Date(stats.latestWorkout.completedAt).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}
                </p>
              </>
            ) : (
              <p className='mt-2 text-sm text-slate-400'>
                No workouts have been saved yet.
              </p>
            )}
          </div>

          {stats.latestWorkout && (
            <Link
              href={`/history/${stats.latestWorkout.id}`}
              className='w-fit rounded text-sm font-semibold text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            >
              View details
            </Link>
          )}
        </div>
      </section>

      {recentProgress && stats.totalWorkouts >= 2 && (
        <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
          <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
            Recent progress
          </p>

          <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-sm text-slate-400'>Latest completed sets</p>

              <p className='mt-1 text-3xl font-bold text-white'>
                {recentProgress.currentCompletedSets}
              </p>

              <p className='mt-1 text-sm text-slate-500'>
                Previous workout: {recentProgress.previousCompletedSets}
              </p>
            </div>

            <div
              className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                recentProgress.difference > 0
                  ? 'bg-green-950 text-green-300'
                  : recentProgress.difference < 0
                    ? 'bg-amber-950 text-amber-300'
                    : 'bg-slate-800 text-slate-300'
              }`}
            >
              {recentProgress.difference > 0
                ? `+${recentProgress.difference} sets`
                : recentProgress.difference < 0
                  ? `${recentProgress.difference} sets`
                  : 'No change'}
            </div>
          </div>
        </section>
      )}

      <section className='grid gap-4 sm:grid-cols-2'>
        <Link
          href='/workouts/day-1'
          className='rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
        >
          <p className='text-sm text-slate-400'>Workout</p>
          <h2 className='mt-1 text-xl font-semibold text-white'>Day 1</h2>
          <p className='mt-2 text-sm text-slate-400'>
            Squat, bench press, rows, Romanian deadlift, shoulders, arms, and
            plank.
          </p>
        </Link>

        <Link
          href='/workouts/day-2'
          className='rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
        >
          <p className='text-sm text-slate-400'>Workout</p>
          <h2 className='mt-1 text-xl font-semibold text-white'>Day 2</h2>
          <p className='mt-2 text-sm text-slate-400'>
            Deadlift, incline press, vertical pull, Zercher squat, rows, lateral
            raises, and core.
          </p>
        </Link>
      </section>
    </div>
  );
}
