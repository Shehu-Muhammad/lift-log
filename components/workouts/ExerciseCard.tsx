import type { Exercise } from '@/types/workout';

type ExerciseCardProps = {
  exercise: Exercise;
  exerciseNumber: number;
};

export default function ExerciseCard({
  exercise,
  exerciseNumber,
}: ExerciseCardProps) {
  return (
    <article className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
      <div className='flex items-start gap-4'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white'>
          {exerciseNumber}
        </div>

        <div>
          <h3 className='text-lg font-semibold text-white'>{exercise.name}</h3>

          <p className='mt-1 text-sm text-slate-300'>
            {exercise.sets} sets × {exercise.reps}
          </p>

          {exercise.notes && (
            <p className='mt-2 text-sm text-slate-400'>{exercise.notes}</p>
          )}
        </div>
      </div>
    </article>
  );
}
