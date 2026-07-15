import { notFound } from 'next/navigation';
import { workouts } from '@/data/workouts';
import WorkoutLogger from '@/components/workouts/WorkoutLogger';

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
        <WorkoutLogger workout={workout} />
      </div>
    </section>
  );
}
