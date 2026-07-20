import Dashboard from '@/components/dashboard/Dashboard';

export default function HomePage() {
  return (
    <section>
      <p className='text-sm font-medium uppercase tracking-wider text-blue-400'>
        LiftLog Dashboard
      </p>

      <h1 className='mt-2 text-3xl font-bold text-white'>
        Track your training progress
      </h1>

      <p className='mt-2 max-w-2xl text-slate-400'>
        Review your recent activity, continue your workout rotation, and keep
        building strength.
      </p>

      <Dashboard />
    </section>
  );
}
