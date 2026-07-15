import Image from 'next/image';

export default function Home() {
  return (
    <main className='min-h-screen bg-slate-950 p-8 text-white'>
      <h1 className='text-4xl font-bold'>LiftLog</h1>
      <p className='mt-2 text-slate-300'>
        Track your workouts, nutrition, and progress.
      </p>
    </main>
  );
}
