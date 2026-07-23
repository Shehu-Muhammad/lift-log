'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  deleteBodyWeightEntry,
  getBodyWeightLogs,
  getTargetWeight,
  saveBodyWeightEntry,
  saveTargetWeight,
} from '@/lib/storage/bodyWeightLogs';
import type { BodyWeightEntry } from '@/types/bodyWeight';
import BodyWeightChart from '@/components/progress/BodyWeightChart';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function isFutureDate(date: string): boolean {
  return date > getTodayDate();
}

export default function BodyWeightTracker() {
  const [date, setDate] = useState(getTodayDate);
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('215');
  const [entries, setEntries] = useState<BodyWeightEntry[]>([]);
  const [saveMessage, setSaveMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    setEntries(getBodyWeightLogs());
    setTargetWeight(String(getTargetWeight()));
  }, []);

  const currentWeight = entries[0]?.weight;

  const startingWeight = entries.at(-1)?.weight;

  const weightChange =
    currentWeight !== undefined && startingWeight !== undefined
      ? currentWeight - startingWeight
      : 0;

  const distanceFromTarget = useMemo(() => {
    const parsedTarget = Number(targetWeight);

    if (currentWeight === undefined || !Number.isFinite(parsedTarget)) {
      return undefined;
    }

    return currentWeight - parsedTarget;
  }, [currentWeight, targetWeight]);

  function handleSaveEntry() {
    const parsedWeight = Number(weight);

    if (!date) {
      setMessageType('error');
      setSaveMessage('Choose a weigh-in date.');
      return;
    }

    if (isFutureDate(date)) {
      setMessageType('error');
      setSaveMessage('Weigh-in dates cannot be in the future.');
      return;
    }

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      setMessageType('error');
      setSaveMessage('Enter a valid body weight.');
      return;
    }

    const entry: BodyWeightEntry = {
      id: crypto.randomUUID(),
      date,
      weight: parsedWeight,
    };

    saveBodyWeightEntry(entry);
    setEntries(getBodyWeightLogs());
    setWeight('');
    setMessageType('success');
    setSaveMessage('Body weight saved successfully.');
  }

  function handleSaveTarget() {
    const parsedTarget = Number(targetWeight);

    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setMessageType('error');
      setSaveMessage('Enter a valid target weight.');
      return;
    }

    saveTargetWeight(parsedTarget);
    setMessageType('success');
    setSaveMessage('Target weight saved successfully.');
  }

  function handleDelete(entry: BodyWeightEntry) {
    const confirmed = window.confirm(
      `Delete the ${entry.weight} lb weigh-in from ${new Date(
        `${entry.date}T00:00:00`,
      ).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}?`,
    );

    if (!confirmed) {
      return;
    }

    deleteBodyWeightEntry(entry.id);
    setEntries(getBodyWeightLogs());
    setMessageType('success');
    setSaveMessage('Weigh-in deleted.');
  }

  return (
    <div className='mt-8 space-y-8'>
      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <article className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
          <p className='text-sm text-slate-400'>Current weight</p>

          <p className='mt-2 text-3xl font-bold text-white'>
            {currentWeight !== undefined ? `${currentWeight} lbs` : '—'}
          </p>
        </article>

        <article className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
          <p className='text-sm text-slate-400'>Target weight</p>

          <p className='mt-2 text-3xl font-bold text-white'>
            {targetWeight ? `${targetWeight} lbs` : '—'}
          </p>
        </article>

        <article className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
          <p className='text-sm text-slate-400'>Total change</p>

          <p className='mt-2 text-3xl font-bold text-white'>
            {entries.length >= 2
              ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} lbs`
              : '—'}
          </p>
        </article>

        <article className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
          <p className='text-sm text-slate-400'>From target</p>

          <p className='mt-2 text-3xl font-bold text-white'>
            {distanceFromTarget !== undefined
              ? `${Math.abs(distanceFromTarget).toFixed(1)} lbs`
              : '—'}
          </p>

          {distanceFromTarget !== undefined && (
            <p className='mt-1 text-sm text-slate-500'>
              {distanceFromTarget > 0
                ? 'above target'
                : distanceFromTarget < 0
                  ? 'below target'
                  : 'target reached'}
            </p>
          )}
        </article>
      </section>

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
          Weight trend
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>
          Progress over time
        </h2>

        <BodyWeightChart entries={entries} />
      </section>

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-blue-400'>
          New weigh-in
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>Log body weight</h2>

        <div className='mt-6 grid gap-4 sm:grid-cols-2'>
          <label className='text-sm text-slate-300'>
            Date
            <input
              type='date'
              value={date}
              max={getTodayDate()}
              onChange={(event) => {
                setDate(event.target.value);
                setMessageType('');
                setSaveMessage('');
              }}
              className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500'
            />
          </label>

          <label className='text-sm text-slate-300'>
            Weight
            <div className='relative mt-1'>
              <input
                type='number'
                min='1'
                step='0.1'
                inputMode='decimal'
                placeholder='210'
                value={weight}
                onChange={(event) => {
                  setWeight(event.target.value);
                  setMessageType('');
                  setSaveMessage('');
                }}
                className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-14 text-white outline-none focus:border-blue-500'
              />

              <span className='absolute inset-y-0 right-3 flex items-center text-sm text-slate-500'>
                lbs
              </span>
            </div>
          </label>
        </div>

        <button
          type='button'
          onClick={handleSaveEntry}
          className='mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
        >
          Save Weigh-In
        </button>
      </section>

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
          Goal
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>Target weight</h2>

        <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
          <div className='relative flex-1'>
            <input
              type='number'
              min='1'
              step='0.1'
              inputMode='decimal'
              value={targetWeight}
              onChange={(event) => {
                setTargetWeight(event.target.value);
                setMessageType('');
                setSaveMessage('');
              }}
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-14 text-white outline-none focus:border-blue-500'
            />

            <span className='absolute inset-y-0 right-3 flex items-center text-sm text-slate-500'>
              lbs
            </span>
          </div>

          <button
            type='button'
            onClick={handleSaveTarget}
            className='rounded-lg bg-slate-800 px-5 py-2 font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
          >
            Save Target
          </button>
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

      <section className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <p className='text-sm font-medium uppercase tracking-wide text-slate-500'>
          History
        </p>

        <h2 className='mt-2 text-2xl font-bold text-white'>Recent weigh-ins</h2>

        {entries.length === 0 ? (
          <p className='mt-5 text-sm text-slate-400'>
            No weigh-ins have been saved yet.
          </p>
        ) : (
          <div className='mt-5 space-y-3'>
            {entries.map((entry) => (
              <article
                key={entry.id}
                className='flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4'
              >
                <div>
                  <p className='font-semibold text-white'>{entry.weight} lbs</p>

                  <p className='mt-1 text-sm text-slate-400'>
                    {new Date(`${entry.date}T00:00:00`).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      },
                    )}
                  </p>
                </div>

                <button
                  type='button'
                  onClick={() => handleDelete(entry)}
                  className='rounded text-sm font-semibold text-red-400 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
