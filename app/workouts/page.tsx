import WorkoutCard from '@/components/workouts/WorkoutCard';
import { workouts } from '@/data/workouts';

export default function WorkoutsPage() {
  return (
    <section>
      <div>
        <p className='text-sm font-medium uppercase tracking-wider text-blue-400'>
          Training Plan
        </p>

        <h1 className='mt-2 text-3xl font-bold text-white'>
          Two-Day Full-Body Workout
        </h1>

        <p className='mt-2 max-w-2xl text-slate-400'>
          Complete each workout once per week with at least one recovery day
          between sessions.
        </p>
      </div>

      <div className='mt-8 grid gap-8 lg:grid-cols-2'>
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </section>
  );
}
