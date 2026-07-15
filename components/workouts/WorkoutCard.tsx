import Link from 'next/link';
import ExerciseCard from '@/components/workouts/ExerciseCard';
import type { Workout } from '@/types/workout';

type WorkoutCardProps = {
  workout: Workout;
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <section className='rounded-2xl border border-slate-800 bg-slate-950 p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-white'>{workout.name}</h2>

          <p className='mt-2 text-sm text-slate-400'>{workout.description}</p>
        </div>

        <Link
          href={`/workouts/${workout.id}`}
          className='shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500'
        >
          Start Workout
        </Link>
      </div>

      <div className='mt-6 space-y-4'>
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseNumber={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
