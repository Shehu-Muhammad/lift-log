'use client';

import { useEffect, useState } from 'react';
import { getWorkoutLogs, saveWorkoutLog } from '@/lib/storage/workoutLogs';
import {
  getPreviousPerformance,
  type PreviousPerformance,
} from '@/lib/workouts/previousPerformance';
import type { Workout } from '@/types/workout';
import type { WorkoutLog } from '@/types/workoutLog';
import {
  getProgressionSuggestion,
  type ProgressionSuggestion,
} from '@/lib/workouts/progressionSuggestion';

type WorkoutLoggerProps = {
  workout: Workout;
};

type SetEntry = {
  weight: string;
  reps: string;
  duration: string;
  completed: boolean;
};

type WorkoutEntries = Record<string, SetEntry>;

export default function WorkoutLogger({ workout }: WorkoutLoggerProps) {
  const [entries, setEntries] = useState<WorkoutEntries>({});
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    setWorkoutLogs(getWorkoutLogs());
  }, []);

  function finishWorkout() {
    setSaveMessage('');
    setErrorMessage('');

    const missingExerciseChoice = workout.exercises.find(
      (exercise) => exercise.options && !selectedOptions[exercise.id],
    );

    if (missingExerciseChoice) {
      setErrorMessage(
        `Choose an option for ${missingExerciseChoice.name} before finishing.`,
      );
      return;
    }

    const hasCompletedSet = Object.values(entries).some(
      (entry) => entry.completed,
    );

    const completedSetMissingData = Object.values(entries).some(
      (entry) =>
        entry.completed &&
        entry.weight.trim() === '' &&
        entry.reps.trim() === '' &&
        entry.duration.trim() === '',
    );

    if (completedSetMissingData) {
      setErrorMessage(
        'Every completed set must include weight, reps, or time.',
      );
      return;
    }

    if (!hasCompletedSet) {
      setErrorMessage('Complete at least one set before saving the workout.');
      return;
    }
    const workoutLog: WorkoutLog = {
      id: crypto.randomUUID(),
      workoutId: workout.id,
      workoutName: workout.name,
      completedAt: new Date().toISOString(),
      exercises: workout.exercises.map((exercise) => {
        const selectedOptionId = selectedOptions[exercise.id];

        const selectedOption = exercise.options?.find(
          (option) => option.id === selectedOptionId,
        );

        return {
          exerciseId: exercise.id,
          exerciseName: selectedOption?.name ?? exercise.name,
          selectedOptionId: selectedOption?.id,
          selectedOptionName: selectedOption?.name,
          sets: Array.from({ length: exercise.sets }).map((_, setIndex) => {
            const setId = `${exercise.id}-${setIndex}`;
            const entry = entries[setId] ?? {
              weight: '',
              reps: '',
              duration: '',
              completed: false,
            };

            return {
              setNumber: setIndex + 1,
              weight:
                entry.weight.trim() !== '' ? Number(entry.weight) : undefined,
              reps: entry.reps.trim() !== '' ? Number(entry.reps) : undefined,
              duration:
                entry.duration.trim() !== ''
                  ? Number(entry.duration)
                  : undefined,
              completed: entry.completed,
            };
          }),
        };
      }),
    };

    saveWorkoutLog(workoutLog);

    setWorkoutLogs(getWorkoutLogs());
    setSaveMessage('Workout saved successfully!');
    setEntries({});
    setSelectedOptions({});
  }

  function selectExerciseOption(exerciseId: string, optionId: string) {
    setSaveMessage('');
    setErrorMessage('');
    setSelectedOptions((current) => ({
      ...current,
      [exerciseId]: optionId,
    }));
  }

  function getSetEntry(setId: string): SetEntry {
    return (
      entries[setId] ?? {
        weight: '',
        reps: '',
        duration: '',
        completed: false,
      }
    );
  }

  function updateSet(
    setId: string,
    field: keyof SetEntry,
    value: string | boolean,
  ) {
    setSaveMessage('');
    setErrorMessage('');

    setEntries((current) => {
      const currentEntry: SetEntry = current[setId] ?? {
        weight: '',
        reps: '',
        duration: '',
        completed: false,
      };

      const updatedEntry = {
        ...currentEntry,
        [field]: value,
      };

      return {
        ...current,
        [setId]: updatedEntry,
      };
    });
  }

  return (
    <div className='mt-8 space-y-6'>
      {workout.exercises.map((exercise, exerciseIndex) => {
        const selectedOptionId = selectedOptions[exercise.id];

        const selectedOption = exercise.options?.find(
          (option) => option.id === selectedOptionId,
        );

        const trackingType =
          selectedOption?.trackingType ??
          exercise.trackingType ??
          'weight-reps';

        const previousPerformance: PreviousPerformance | undefined =
          getPreviousPerformance(
            workoutLogs,
            workout.id,
            exercise.id,
            selectedOption?.id,
          );
        const previousSet = previousPerformance?.sets[0];
        const progressionSuggestion: ProgressionSuggestion | undefined =
          previousPerformance
            ? getProgressionSuggestion({
                trackingType,
                previousSets: previousPerformance.sets,
                targetReps: exercise.reps,
                expectedSetCount: exercise.sets,
              })
            : undefined;

        return (
          <section
            key={exercise.id}
            className='rounded-xl border border-slate-800 bg-slate-900 p-5'
          >
            <div>
              <h2 className='text-lg font-semibold text-white'>
                {exerciseIndex + 1}. {exercise.name}
              </h2>

              <p className='mt-1 text-sm text-slate-400'>
                Target: {exercise.sets} sets × {exercise.reps}
              </p>

              {exercise.notes && (
                <p className='mt-2 text-sm text-slate-500'>{exercise.notes}</p>
              )}

              {exercise.options && (
                <div className='mt-4'>
                  <p className='text-sm font-medium text-slate-300'>
                    Choose exercise
                  </p>

                  <div className='mt-2 flex flex-wrap gap-2'>
                    {exercise.options.map((option) => {
                      const isSelected = selectedOptionId === option.id;

                      return (
                        <button
                          key={option.id}
                          type='button'
                          onClick={() =>
                            selectExerciseOption(exercise.id, option.id)
                          }
                          aria-pressed={isSelected}
                          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                            isSelected
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {option.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {(!exercise.options || selectedOption) && previousSet && (
              <div className='mt-4 rounded-lg border border-slate-800 bg-slate-950 p-3'>
                <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>
                  Last time
                </p>

                <p className='mt-1 text-sm text-slate-300'>
                  {previousSet.duration !== undefined
                    ? `${previousSet.duration} seconds`
                    : previousSet.weight !== undefined
                      ? `${previousSet.weight} lbs × ${previousSet.reps ?? 0} reps`
                      : `${previousSet.reps ?? 0} reps`}
                </p>
              </div>
            )}

            {(!exercise.options || selectedOption) && progressionSuggestion && (
              <div
                className={`mt-3 rounded-lg border p-3 ${
                  progressionSuggestion.status === 'increase'
                    ? 'border-green-900 bg-green-950/40'
                    : progressionSuggestion.status === 'complete-sets'
                      ? 'border-amber-900 bg-amber-950/40'
                      : 'border-blue-900 bg-blue-950/40'
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    progressionSuggestion.status === 'increase'
                      ? 'text-green-400'
                      : progressionSuggestion.status === 'complete-sets'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                  }`}
                >
                  {progressionSuggestion.status === 'increase'
                    ? 'Ready to progress'
                    : progressionSuggestion.status === 'complete-sets'
                      ? 'Complete all sets'
                      : 'Repeat and improve'}
                </p>

                <p className='mt-1 text-sm text-slate-100'>
                  {progressionSuggestion.message}
                </p>
              </div>
            )}

            {exercise.options && !selectedOption ? (
              <p className='mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400'>
                Choose an exercise to begin logging sets.
              </p>
            ) : (
              <div className='mt-5 space-y-3'>
                {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                  const setId = `${exercise.id}-${setIndex}`;
                  const entry = getSetEntry(setId);
                  const previousSetForIndex =
                    previousPerformance?.sets[setIndex];

                  return (
                    <div
                      key={setId}
                      className='grid grid-cols-1 gap-3 rounded-lg border border-slate-800 p-3 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end'
                    >
                      <span className='text-sm font-medium text-slate-400 sm:pb-2'>
                        Set {setIndex + 1}
                      </span>

                      {trackingType === 'duration' ? (
                        <label className='text-sm text-slate-300 sm:col-span-2'>
                          Time
                          <div className='relative mt-1'>
                            <input
                              type='number'
                              min='0'
                              step='1'
                              inputMode='numeric'
                              placeholder={
                                previousSetForIndex?.duration !== undefined
                                  ? String(previousSetForIndex.duration)
                                  : '60'
                              }
                              value={entry.duration}
                              onChange={(event) =>
                                updateSet(setId, 'duration', event.target.value)
                              }
                              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-20 text-white outline-none transition focus:border-blue-500'
                            />

                            <span className='absolute inset-y-0 right-3 flex items-center text-sm text-slate-500'>
                              seconds
                            </span>
                          </div>
                        </label>
                      ) : (
                        <>
                          {trackingType === 'weight-reps' && (
                            <label className='text-sm text-slate-300'>
                              Weight
                              <input
                                type='number'
                                min='0'
                                step='0.5'
                                inputMode='decimal'
                                placeholder={
                                  previousSetForIndex?.weight !== undefined
                                    ? String(previousSetForIndex.weight)
                                    : 'lbs'
                                }
                                value={entry.weight}
                                onChange={(event) =>
                                  updateSet(setId, 'weight', event.target.value)
                                }
                                className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-blue-500'
                              />
                            </label>
                          )}

                          <label
                            className={`text-sm text-slate-300 ${
                              trackingType === 'bodyweight-reps'
                                ? 'sm:col-span-2'
                                : ''
                            }`}
                          >
                            Reps
                            <input
                              type='number'
                              min='0'
                              step='1'
                              inputMode='numeric'
                              placeholder={
                                previousSetForIndex?.reps !== undefined
                                  ? String(previousSetForIndex.reps)
                                  : '0'
                              }
                              value={entry.reps}
                              onChange={(event) =>
                                updateSet(setId, 'reps', event.target.value)
                              }
                              className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-blue-500'
                            />
                          </label>
                        </>
                      )}

                      <button
                        type='button'
                        onClick={() =>
                          updateSet(setId, 'completed', !entry.completed)
                        }
                        aria-pressed={entry.completed}
                        className={`rounded-lg px-3 py-2 font-semibold transition ${
                          entry.completed
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {entry.completed ? 'Done' : 'Mark'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {errorMessage && (
        <p
          role='alert'
          className='rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-300'
        >
          {errorMessage}
        </p>
      )}

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
        onClick={finishWorkout}
        className='w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500'
      >
        Finish Workout
      </button>
    </div>
  );
}
