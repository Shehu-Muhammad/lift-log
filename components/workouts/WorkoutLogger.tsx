'use client';

import { useState } from 'react';
import type { Workout } from '@/types/workout';
import { saveWorkoutLog } from '@/lib/storage/workoutLogs';
import type { WorkoutLog } from '@/types/workoutLog';

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

  // function finishWorkout() {
  //   console.log('ENTRIES BEFORE SAVE:', entries);
  //   const workoutLog: WorkoutLog = {
  //     id: crypto.randomUUID(),
  //     workoutId: workout.id,
  //     workoutName: workout.name,
  //     completedAt: new Date().toISOString(),
  //     exercises: workout.exercises.map((exercise) => {
  //       const selectedOptionId = selectedOptions[exercise.id];

  //       const selectedOption = exercise.options?.find(
  //         (option) => option.id === selectedOptionId,
  //       );

  //       return {
  //         exerciseId: exercise.id,
  //         exerciseName: selectedOption?.name ?? exercise.name,
  //         selectedOptionId: selectedOption?.id,
  //         selectedOptionName: selectedOption?.name,
  //         sets: Array.from({ length: exercise.sets }).map((_, setIndex) => {
  //           const setId = `${exercise.id}-${setIndex}`;
  //           const entry = entries[setId] ?? {
  //             weight: '',
  //             reps: '',
  //             duration: '',
  //             completed: false,
  //           };

  //           console.log('Saving:', setId, entry);

  //           return {
  //             setNumber: setIndex + 1,
  //             weight:
  //               entry.weight.trim() !== '' ? Number(entry.weight) : undefined,
  //             reps: entry.reps.trim() !== '' ? Number(entry.reps) : undefined,
  //             duration:
  //               entry.duration.trim() !== ''
  //                 ? Number(entry.duration)
  //                 : undefined,
  //             completed: entry.completed,
  //           };
  //         }),
  //       };
  //     }),
  //   };

  //   saveWorkoutLog(workoutLog);

  //   setSaveMessage('Workout saved successfully!');
  //   setEntries({});
  //   setSelectedOptions({});
  // }
  function finishWorkout() {
    console.log('finishWorkout started');
    console.log('Current entries:', entries);
    console.log('Selected options:', selectedOptions);

    try {
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

      console.log('Workout log before save:', workoutLog);

      saveWorkoutLog(workoutLog);

      setSaveMessage('Workout saved successfully.');
      setEntries({});
      setSelectedOptions({});
    } catch (error) {
      console.error('Workout save failed:', error);
      setSaveMessage('Workout could not be saved.');
    }
  }

  function selectExerciseOption(exerciseId: string, optionId: string) {
    setSaveMessage('');
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

      console.log('Updating set:', setId, updatedEntry);

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

            {exercise.options && !selectedOption ? (
              <p className='mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400'>
                Choose Pull-Ups or Lat Pulldown to begin logging sets.
              </p>
            ) : (
              <div className='mt-5 space-y-3'>
                {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                  const setId = `${exercise.id}-${setIndex}`;
                  const entry = getSetEntry(setId);

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
                              inputMode='numeric'
                              placeholder='60'
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
                                placeholder='lbs'
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
                              inputMode='numeric'
                              placeholder='0'
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

      {saveMessage && (
        <p
          role='status'
          className='rounded-lg border border-green-800 bg-green-950 p-3 text-sm text-green-300'
        >
          {saveMessage}
        </p>
      )}

      {/* <button
        type='button'
        onClick={finishWorkout}
        className='w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500'
      >
        Finish Workout
      </button> */}
      <button
        type='button'
        onClick={() => {
          console.log('Finish button clicked');
          finishWorkout();
        }}
        className='w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white'
      >
        Finish Workout
      </button>
    </div>
  );
}
