import { notFound } from 'next/navigation';
import { workouts } from '@/data/workouts';

type WorkoutPageProps = {
  params: Promise<{
    workoutId: string;
  }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { workoutId } = await params;

  const workout = workouts.find((item) => item.id === workoutId);

  if (!workout) {
    notFound();
  }

  return (
    <section>
      <p className='text-sm font-medium uppercase tracking-wider text-blue-400'>
        Active Workout
      </p>

      <h1 className='mt-2 text-3xl font-bold text-white'>{workout.name}</h1>

      <p className='mt-2 text-slate-400'>{workout.description}</p>

      <div className='mt-8 space-y-4'>
        {workout.exercises.map((exercise, index) => (
          <article
            key={exercise.id}
            className='rounded-xl border border-slate-800 bg-slate-900 p-5'
          >
            <h2 className='text-lg font-semibold text-white'>
              {index + 1}. {exercise.name}
            </h2>

            <p className='mt-1 text-sm text-slate-300'>
              {exercise.sets} sets × {exercise.reps}
            </p>

            {exercise.notes && (
              <p className='mt-2 text-sm text-slate-400'>{exercise.notes}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
