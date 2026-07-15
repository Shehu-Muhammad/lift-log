export type LoggedSet = {
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number;
  completed: boolean;
};

export type LoggedExercise = {
  exerciseId: string;
  exerciseName: string;
  selectedOptionId?: string;
  selectedOptionName?: string;
  sets: LoggedSet[];
};

export type WorkoutLog = {
  id: string;
  workoutId: string;
  workoutName: string;
  completedAt: string;
  exercises: LoggedExercise[];
};
