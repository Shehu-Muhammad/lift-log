export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
};