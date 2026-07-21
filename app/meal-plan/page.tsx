import MealPlanView from '@/components/nutrition/MealPlanView';

export default function MealPlanPage() {
  return (
    <section>
      <p className='text-sm font-medium uppercase tracking-wider text-blue-400'>
        Nutrition
      </p>

      <h1 className='mt-2 text-3xl font-bold text-white'>
        Daily Meal Plan
      </h1>

      <p className='mt-2 max-w-2xl text-slate-400'>
        Review your planned meals and daily macro totals.
      </p>

      <MealPlanView />
    </section>
  );
}
