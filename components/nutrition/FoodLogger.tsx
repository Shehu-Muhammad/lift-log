'use client';

import { useEffect, useMemo, useState } from 'react';
import { commonFoods } from '@/data/commonFoods';
import {
  deleteFoodLogEntry,
  getFoodLogsByDate,
  saveFoodLogEntry,
} from '@/lib/storage/foodLogs';
import type { FoodLogEntry, MealType } from '@/types/food';

const mealTypes: Array<{
  value: MealType;
  label: string;
}> = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function FoodLogger() {
  const [date] = useState(getTodayDate);
  const [selectedFoodId, setSelectedFoodId] = useState(commonFoods[0]?.id ?? '');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [servings, setServings] = useState('1');
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);
  const [saveMessage, setSaveMessage] = useState('');

  const selectedFood = commonFoods.find(
    (food) => food.id === selectedFoodId,
  );

  useEffect(() => {
    setEntries(getFoodLogsByDate(date));
  }, [date]);

  const totals = useMemo(
    () =>
      entries.reduce(
        (currentTotals, entry) => ({
          calories: currentTotals.calories + entry.calories,
          protein: currentTotals.protein + entry.protein,
          carbs: currentTotals.carbs + entry.carbs,
          fat: currentTotals.fat + entry.fat,
          fiber: currentTotals.fiber + entry.fiber,
        }),
        {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
        },
      ),
    [entries],
  );

  function handleAddFood() {
    if (!selectedFood) {
      setSaveMessage('Choose a food.');
      return;
    }

    const servingCount = Number(servings);

    if (!Number.isFinite(servingCount) || servingCount <= 0) {
      setSaveMessage('Enter a serving amount greater than zero.');
      return;
    }

    const entry: FoodLogEntry = {
      id: crypto.randomUUID(),
      date,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      mealType,
      servings: servingCount,
      servingLabel: selectedFood.servingLabel,
      calories: selectedFood.calories * servingCount,
      protein: selectedFood.protein * servingCount,
      carbs: selectedFood.carbs * servingCount,
      fat: selectedFood.fat * servingCount,
      fiber: selectedFood.fiber * servingCount,
    };

    saveFoodLogEntry(entry);
    setEntries(getFoodLogsByDate(date));
    setServings('1');
    setSaveMessage(`${selectedFood.name} added.`);
  }

  function handleDelete(entryId: string) {
    deleteFoodLogEntry(entryId);
    setEntries(getFoodLogsByDate(date));
    setSaveMessage('Food entry deleted.');
  }

  return (
    <div className='mt-8 space-y-8'>
      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-blue-400'>
          Add food
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>
          Log a meal item
        </h2>

        <div className='mt-6 grid gap-4 md:grid-cols-3'>
          <label className='text-sm text-slate-300'>
            Food
            <select
              value={selectedFoodId}
              onChange={(event) => {
                setSelectedFoodId(event.target.value);
                setSaveMessage('');
              }}
              className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500'
            >
              {commonFoods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} — {food.servingLabel}
                </option>
              ))}
            </select>
          </label>

          <label className='text-sm text-slate-300'>
            Meal
            <select
              value={mealType}
              onChange={(event) => {
                setMealType(event.target.value as MealType);
                setSaveMessage('');
              }}
              className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500'
            >
              {mealTypes.map((meal) => (
                <option key={meal.value} value={meal.value}>
                  {meal.label}
                </option>
              ))}
            </select>
          </label>

          <label className='text-sm text-slate-300'>
            Servings
            <input
              type='number'
              min='0.25'
              step='0.25'
              value={servings}
              onChange={(event) => {
                setServings(event.target.value);
                setSaveMessage('');
              }}
              className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500'
            />
          </label>
        </div>

        {selectedFood && (
          <div className='mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4'>
            <p className='text-sm font-medium text-white'>
              {selectedFood.name}
            </p>

            <p className='mt-1 text-sm text-slate-400'>
              Per {selectedFood.servingLabel}: {selectedFood.calories} kcal,{' '}
              {selectedFood.protein}g protein, {selectedFood.carbs}g carbs,{' '}
              {selectedFood.fat}g fat, {selectedFood.fiber}g fiber
            </p>
          </div>
        )}

        <button
          type='button'
          onClick={handleAddFood}
          className='mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500'
        >
          Add Food
        </button>
      </section>

      {saveMessage && (
        <p
          role='status'
          className='rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300'
        >
          {saveMessage}
        </p>
      )}

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
          Today’s food
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>
          Logged entries
        </h2>

        {entries.length === 0 ? (
          <p className='mt-5 text-sm text-slate-400'>
            No foods logged today.
          </p>
        ) : (
          <div className='mt-5 space-y-3'>
            {entries.map((entry) => (
              <article
                key={entry.id}
                className='flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-start sm:justify-between'
              >
                <div>
                  <p className='font-medium text-white'>{entry.foodName}</p>

                  <p className='mt-1 text-sm capitalize text-slate-400'>
                    {entry.mealType} · {entry.servings} × {entry.servingLabel}
                  </p>

                  <p className='mt-2 text-sm text-slate-300'>
                    {Math.round(entry.calories)} kcal ·{' '}
                    {entry.protein.toFixed(1)}g protein ·{' '}
                    {entry.carbs.toFixed(1)}g carbs ·{' '}
                    {entry.fat.toFixed(1)}g fat ·{' '}
                    {entry.fiber.toFixed(1)}g fiber
                  </p>
                </div>

                <button
                  type='button'
                  onClick={() => handleDelete(entry.id)}
                  className='w-fit text-sm font-semibold text-red-400 hover:text-red-300'
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
          Food totals
        </p>

        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          <div>
            <p className='text-sm text-slate-400'>Calories</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {Math.round(totals.calories)}
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Protein</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {totals.protein.toFixed(1)}g
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Carbs</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {totals.carbs.toFixed(1)}g
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Fat</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {totals.fat.toFixed(1)}g
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-400'>Fiber</p>
            <p className='mt-1 text-xl font-semibold text-white'>
              {totals.fiber.toFixed(1)}g
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
