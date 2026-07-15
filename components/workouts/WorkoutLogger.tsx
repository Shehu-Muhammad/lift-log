"use client";

import { useState } from "react";
import type { Workout } from "@/types/workout";

type WorkoutLoggerProps = {
  workout: Workout;
};

export default function WorkoutLogger({ workout }: WorkoutLoggerProps) {
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>(
    {},
  );

  function toggleSet(setId: string) {
    setCompletedSets((current) => ({
      ...current,
      [setId]: !current[setId],
    }));
  }

  return (
    <div className="mt-8 space-y-6">
      {workout.exercises.map((exercise, exerciseIndex) => (
        <section
          key={exercise.id}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <div>
            <h2 className="text-lg font-semibold text-white">
              {exerciseIndex + 1}. {exercise.name}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Target: {exercise.sets} sets × {exercise.reps}
            </p>

            {exercise.notes && (
              <p className="mt-2 text-sm text-slate-500">{exercise.notes}</p>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {Array.from({ length: exercise.sets }).map((_, setIndex) => {
              const setId = `${exercise.id}-${setIndex}`;
              const isComplete = completedSets[setId] ?? false;

              return (
                <div
                  key={setId}
                  className="grid grid-cols-[auto_1fr_1fr_auto] items-end gap-3"
                >
                  <span className="pb-2 text-sm font-medium text-slate-400">
                    {setIndex + 1}
                  </span>

                  <label className="text-sm text-slate-300">
                    Weight
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      placeholder="lbs"
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-blue-500"
                    />
                  </label>

                  <label className="text-sm text-slate-300">
                    Reps
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="0"
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-blue-500"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => toggleSet(setId)}
                    aria-pressed={isComplete}
                    className={`rounded-lg px-3 py-2 font-semibold transition ${
                      isComplete
                        ? "bg-green-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {isComplete ? "Done" : "Mark"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
