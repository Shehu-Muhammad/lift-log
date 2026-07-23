'use client';

import { useEffect, useState } from 'react';
import {
  getMacroGoals,
  getNutritionLogs,
  saveMacroGoals,
  saveNutritionLog,
} from '@/lib/storage/nutritionLogs';
import type { DailyNutritionLog, MacroGoals } from '@/types/nutrition';

type MacroField = keyof Omit<DailyNutritionLog, 'date'>;

const emptyLog: DailyNutritionLog = {
  date: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
};

export default function NutritionTracker() {
  const [log, setLog] = useState<DailyNutritionLog>(emptyLog);
  const [goals, setGoals] = useState<MacroGoals>({
    calories: 2400,
    protein: 200,
    carbs: 250,
    fat: 70,
    fiber: 30,
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = getNutritionLogs().find((item) => item.date === today);

    setLog(
      existingLog ?? {
        ...emptyLog,
        date: today,
      },
    );

    setGoals(getMacroGoals());
  }, []);

  function updateLog(field: MacroField, value: string) {
    setSaveMessage('');

    setLog((current) => ({
      ...current,
      [field]: value === '' ? 0 : Number(value),
    }));
  }

  function updateGoal(field: keyof MacroGoals, value: string) {
    setSaveMessage('');

    setGoals((current) => ({
      ...current,
      [field]: value === '' ? 0 : Number(value),
    }));
  }

  function handleSave() {
    saveNutritionLog(log);
    saveMacroGoals(goals);
    setSaveMessage('Nutrition saved successfully.');
  }

  const fields: Array<{
    key: MacroField;
    label: string;
    unit: string;
  }> = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
  ];

  return (
    <div className='mt-8 space-y-8'>
      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-wide text-blue-400'>
              Today
            </p>

            <h2 className='mt-2 text-2xl font-bold text-white'>
              Daily macro totals
            </h2>

            <p className='mt-2 text-sm text-slate-400'>
              Enter your current totals for today.
            </p>
          </div>

          <span className='w-fit rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300'>
            {log.date}
          </span>
        </div>

        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {fields.map((field) => (
            <label key={field.key} className='text-sm text-slate-300'>
              {field.label}

              <div className='relative mt-1'>
                <input
                  type='number'
                  min='0'
                  step='1'
                  value={log[field.key]}
                  onChange={(event) => updateLog(field.key, event.target.value)}
                  className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-14 text-white outline-none transition focus:border-blue-500'
                />

                <span className='absolute inset-y-0 right-3 flex items-center text-xs text-slate-500'>
                  {field.unit}
                </span>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
          Daily goals
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>Macro targets</h2>

        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {fields.map((field) => (
            <label key={field.key} className='text-sm text-slate-300'>
              {field.label}

              <div className='relative mt-1'>
                <input
                  type='number'
                  min='0'
                  step='1'
                  value={goals[field.key]}
                  onChange={(event) =>
                    updateGoal(field.key, event.target.value)
                  }
                  className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-14 text-white outline-none transition focus:border-blue-500'
                />

                <span className='absolute inset-y-0 right-3 flex items-center text-xs text-slate-500'>
                  {field.unit}
                </span>
              </div>
            </label>
          ))}
        </div>
      </section>

      {saveMessage && (
        <p
          role='status'
          className='rounded-lg border border-green-800 bg-green-950 p-3 text-sm text-green-300'
        >
          {saveMessage}
        </p>
      )}

      <button
        type='button'
        onClick={handleSave}
        className='w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
      >
        Save Nutrition
      </button>
    </div>
  );
}
