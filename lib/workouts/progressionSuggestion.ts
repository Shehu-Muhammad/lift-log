import type { LoggedSet } from '@/types/workoutLog';
import type { ExerciseTrackingType } from '@/types/workout';

export type ProgressionSuggestion = {
  message: string;
  suggestedWeight?: number;
  suggestedReps?: number;
  suggestedDuration?: number;
};

type GetProgressionSuggestionArgs = {
  trackingType: ExerciseTrackingType;
  previousSets: LoggedSet[];
  targetReps: string;
};

function getHighestCompletedWeight(sets: LoggedSet[]): number | undefined {
  const weights = sets
    .filter((set) => set.completed && set.weight !== undefined)
    .map((set) => set.weight as number);

  return weights.length > 0 ? Math.max(...weights) : undefined;
}

function getLowestCompletedReps(sets: LoggedSet[]): number | undefined {
  const reps = sets
    .filter((set) => set.completed && set.reps !== undefined)
    .map((set) => set.reps as number);

  return reps.length > 0 ? Math.min(...reps) : undefined;
}

function getLowestCompletedDuration(sets: LoggedSet[]): number | undefined {
  const durations = sets
    .filter((set) => set.completed && set.duration !== undefined)
    .map((set) => set.duration as number);

  return durations.length > 0 ? Math.min(...durations) : undefined;
}

function getTargetRepMaximum(targetReps: string): number | undefined {
  const matches = targetReps.match(/\d+/g);

  if (!matches || matches.length === 0) {
    return undefined;
  }

  return Number(matches[matches.length - 1]);
}

export function getProgressionSuggestion({
  trackingType,
  previousSets,
  targetReps,
}: GetProgressionSuggestionArgs): ProgressionSuggestion | undefined {
  const completedSets = previousSets.filter((set) => set.completed);

  if (completedSets.length === 0) {
    return undefined;
  }

  if (trackingType === 'duration') {
    const previousDuration = getLowestCompletedDuration(completedSets);

    if (previousDuration === undefined) {
      return undefined;
    }

    return {
      message: `Try holding for ${previousDuration + 5} seconds.`,
      suggestedDuration: previousDuration + 5,
    };
  }

  const lowestReps = getLowestCompletedReps(completedSets);

  if (lowestReps === undefined) {
    return undefined;
  }

  const targetMaximum = getTargetRepMaximum(targetReps);

  if (trackingType === 'bodyweight-reps') {
    if (targetMaximum !== undefined && lowestReps >= targetMaximum) {
      return {
        message: `Try ${lowestReps + 1} reps per set.`,
        suggestedReps: lowestReps + 1,
      };
    }

    return {
      message: `Repeat the same rep target and try to complete every set.`,
      suggestedReps: lowestReps,
    };
  }

  const previousWeight = getHighestCompletedWeight(completedSets);

  if (previousWeight === undefined) {
    return undefined;
  }

  if (targetMaximum !== undefined && lowestReps >= targetMaximum) {
    const increase = previousWeight >= 100 ? 5 : 2.5;
    const suggestedWeight = previousWeight + increase;

    return {
      message: `Try ${suggestedWeight} lbs while staying in the target rep range.`,
      suggestedWeight,
      suggestedReps: lowestReps,
    };
  }

  return {
    message: `Keep ${previousWeight} lbs and try to add reps or complete every set.`,
    suggestedWeight: previousWeight,
    suggestedReps: lowestReps,
  };
}
