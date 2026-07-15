import type { Workout } from "@/types/workout";

export const workouts: Workout[] = [
  {
    id: "day-1",
    name: "Day 1",
    description: "Squat, horizontal push, horizontal pull, and posterior chain.",
    exercises: [
      {
        id: "back-squat",
        name: "Back Squat",
        sets: 4,
        reps: "5",
        notes: "Current reference weight: 225 lbs × 5.",
      },
      {
        id: "bench-press",
        name: "Bench Press",
        sets: 4,
        reps: "5",
      },
      {
        id: "bent-over-row",
        name: "Bent-Over Row",
        sets: 4,
        reps: "6–8",
      },
      {
        id: "romanian-deadlift",
        name: "Romanian Deadlift",
        sets: 3,
        reps: "8",
      },
      {
        id: "dumbbell-shoulder-press",
        name: "Dumbbell Shoulder Press",
        sets: 3,
        reps: "10",
      },
      {
        id: "hammer-curl",
        name: "Hammer Curl",
        sets: 3,
        reps: "12",
      },
      {
        id: "plank",
        name: "Plank",
        sets: 3,
        reps: "60 seconds",
      },
    ],
  },
  {
    id: "day-2",
    name: "Day 2",
    description: "Hinge, incline push, vertical pull, and Zercher squat.",
    exercises: [
      {
        id: "deadlift",
        name: "Deadlift",
        sets: 4,
        reps: "5",
        notes: "Use 3–4 working sets depending on recovery.",
      },
      {
        id: "plate-loaded-incline-press",
        name: "Plate-Loaded Incline Press",
        sets: 3,
        reps: "8–10",
      },
      {
        id: "pull-up-lat-pulldown",
        name: "Pull-Ups or Lat Pulldown",
        sets: 3,
        reps: "8–10",
      },
      {
        id: "zercher-squat",
        name: "Zercher Squat",
        sets: 4,
        reps: "6–8",
        notes: "Use 3–4 working sets depending on fatigue.",
      },
      {
        id: "bent-over-row-day-2",
        name: "Bent-Over Row",
        sets: 3,
        reps: "10–12",
      },
      {
        id: "lateral-raise",
        name: "Lateral Raise",
        sets: 3,
        reps: "15",
      },
      {
        id: "ab-wheel-dead-bug",
        name: "Ab Wheel Rollout or Dead Bug",
        sets: 3,
        reps: "8–12",
      },
    ],
  },
];