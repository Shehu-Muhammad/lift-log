import NutritionTracker from '@/components/nutrition/NutritionTracker';

export default function NutritionPage() {
  return (
    <section>
      <p className='text-sm font-medium uppercase tracking-wider text-blue-400'>
        Nutrition
      </p>

      <h1 className='mt-2 text-3xl font-bold text-white'>
        Daily Macro Tracker
      </h1>

      <p className='mt-2 max-w-2xl text-slate-400'>
        Track calories, protein, carbohydrates, fat, and fiber for each day.
      </p>

      <NutritionTracker />
    </section>
  );
}
