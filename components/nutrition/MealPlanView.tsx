'use client';

import { useMemo, useState } from 'react';
import { commonFoods } from '@/data/commonFoods';
import { defaultMealPlan } from '@/data/defaultMealPlan';
import {
  getMealPlanSummaries,
  getMealPlanTotals,
} from '@/lib/nutrition/mealPlanTotals';
import { saveFoodLogEntry } from '@/lib/storage/foodLogs';
import type { MealPlan, MealPlanMeal } from '@/types/mealPlan';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function MealPlanView() {
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [saveMessage, setSaveMessage] = useState('');
  const [mealPlan, setMealPlan] = useState<MealPlan>(() =>
    structuredClone(defaultMealPlan),
  );

  const mealSummaries = useMemo(
    () => getMealPlanSummaries(mealPlan),
    [mealPlan],
  );

  const dailyTotals = useMemo(() => getMealPlanTotals(mealPlan), [mealPlan]);

  function toggleMeal(mealId: string) {
    setSaveMessage('');
    setMessageType('');

    setMealPlan((current) => ({
      ...current,
      meals: current.meals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              enabled: !meal.enabled,
            }
          : meal,
      ),
    }));
  }

  function updateServing(mealId: string, foodId: string, value: string) {
    setSaveMessage('');
    setMessageType('');

    const servings = Number(value);

    if (!Number.isFinite(servings) || servings <= 0) {
      setMessageType('error');
      setSaveMessage('Servings must be greater than 0.');
      return;
    }

    setMealPlan((current) => ({
      ...current,
      meals: current.meals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              items: meal.items.map((item) =>
                item.foodId === foodId
                  ? {
                      ...item,
                      servings,
                    }
                  : item,
              ),
            }
          : meal,
      ),
    }));
  }

  function copyMealToToday(meal: MealPlanMeal) {
    if (!meal.enabled) {
      setMessageType('error');
      setSaveMessage(`${meal.name} is currently skipped.`);
      return;
    }

    meal.items.forEach((item) => {
      const food = commonFoods.find(
        (currentFood) => currentFood.id === item.foodId,
      );

      if (!food) {
        return;
      }

      saveFoodLogEntry({
        id: crypto.randomUUID(),
        date: getTodayDate(),
        foodId: food.id,
        foodName: food.name,
        mealType: meal.mealType,
        servings: item.servings,
        servingLabel: food.servingLabel,
        calories: food.calories * item.servings,
        protein: food.protein * item.servings,
        carbs: food.carbs * item.servings,
        fat: food.fat * item.servings,
        fiber: food.fiber * item.servings,
      });
    });

    setMessageType('success');
    setSaveMessage(`${meal.name} added to today’s food log.`);
  }

  return (
    <div className='mt-8 space-y-8'>
      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-blue-400'>
          Daily plan
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>{mealPlan.name}</h2>

        <p className='mt-2 text-sm text-slate-400'>
          A high-protein daily plan built from your common foods.
        </p>

        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          <div>
            <p className='text-sm text-slate-400'>Calories</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {Math.round(dailyTotals.calories)}
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Protein</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {dailyTotals.protein.toFixed(1)}g
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Carbs</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {dailyTotals.carbs.toFixed(1)}g
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Fat</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {dailyTotals.fat.toFixed(1)}g
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Fiber</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {dailyTotals.fiber.toFixed(1)}g
            </p>
          </div>
        </div>
      </section>

      {saveMessage && (
        <p
          role={messageType === 'error' ? 'alert' : 'status'}
          className={`rounded-lg border p-3 text-sm ${
            messageType === 'error'
              ? 'border-red-800 bg-red-950 text-red-300'
              : 'border-green-800 bg-green-950 text-green-300'
          }`}
        >
          {saveMessage}
        </p>
      )}

      <div className='grid gap-6 lg:grid-cols-2'>
        {mealSummaries.map(({ meal, totals }) => (
          <section
            key={meal.id}
            className={`rounded-xl border border-slate-800 bg-slate-900 p-6 transition ${
              meal.enabled ? '' : 'opacity-60'
            }`}
          >
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
                  {meal.mealType}
                </p>

                <h2 className='mt-1 text-xl font-semibold text-white'>
                  {meal.name}
                </h2>
              </div>

              <button
                type='button'
                onClick={() => toggleMeal(meal.id)}
                aria-pressed={meal.enabled}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 
                ${
                  meal.enabled
                    ? 'bg-green-950 text-green-300 hover:bg-green-900'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {meal.enabled ? 'Enabled' : 'Skipped'}
              </button>
            </div>

            <div className='mt-5 space-y-3'>
              {meal.items.map((item) => {
                const food = commonFoods.find(
                  (currentFood) => currentFood.id === item.foodId,
                );

                if (!food) {
                  return null;
                }

                return (
                  <div
                    key={item.foodId}
                    className='rounded-lg border border-slate-800 bg-slate-950 p-4'
                  >
                    <p className='font-medium text-white'>{food.name}</p>

                    <label className='mt-3 block text-sm text-slate-400'>
                      Servings
                      <div className='mt-1 flex items-center gap-2'>
                        <input
                          type='number'
                          min='0.25'
                          step='0.25'
                          value={item.servings}
                          onChange={(event) =>
                            updateServing(
                              meal.id,
                              item.foodId,
                              event.target.value,
                            )
                          }
                          disabled={!meal.enabled}
                          className='w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
                        />

                        <span className='text-sm text-slate-500'>
                          × {food.servingLabel}
                        </span>
                      </div>
                    </label>

                    <p className='mt-2 text-sm text-slate-300'>
                      {Math.round(food.calories * item.servings)} kcal ·{' '}
                      {(food.protein * item.servings).toFixed(1)}g protein ·{' '}
                      {(food.carbs * item.servings).toFixed(1)}g carbs ·{' '}
                      {(food.fat * item.servings).toFixed(1)}g fat
                    </p>
                  </div>
                );
              })}
            </div>

            <div className='mt-5 border-t border-slate-800 pt-4'>
              <p className='text-sm text-slate-400'>Meal totals</p>

              <p className='mt-2 text-sm text-slate-200'>
                {Math.round(totals.calories)} kcal · {totals.protein.toFixed(1)}
                g protein · {totals.carbs.toFixed(1)}g carbs ·{' '}
                {totals.fat.toFixed(1)}g fat · {totals.fiber.toFixed(1)}g fiber
              </p>
            </div>

            <button
              type='button'
              onClick={() => copyMealToToday(meal)}
              disabled={!meal.enabled}
              className='mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            >
              Add {meal.name} to Today
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
