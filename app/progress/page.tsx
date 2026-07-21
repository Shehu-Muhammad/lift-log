import BodyWeightTracker from '@/components/progress/BodyWeightTracker';
import StrengthProgress from '@/components/progress/StrengthProgress';

export default function ProgressPage() {
  return (
    <section>
      <p className='text-sm font-medium uppercase tracking-wider text-blue-400'>
        Progress
      </p>

      <h1 className='mt-2 text-3xl font-bold text-white'>
        Body and Strength Progress
      </h1>

      <p className='mt-2 max-w-2xl text-slate-400'>
        Track your body weight and review how your training is improving.
      </p>

      <BodyWeightTracker />

      <div className='mt-8'>
        <StrengthProgress />
      </div>
    </section>
  );
}
