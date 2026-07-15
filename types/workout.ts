export type ExerciseTrackingType =
  | "weight-reps"
  | "bodyweight-reps"
  | "duration";

export type ExerciseOption = {
  id: string;
  name: string;
  trackingType: ExerciseTrackingType;
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  trackingType?: ExerciseTrackingType;
  options?: ExerciseOption[];
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
};