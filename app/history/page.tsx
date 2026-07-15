import WorkoutHistory from "@/components/workouts/WorkoutHistory";

export default function HistoryPage() {
  return (
    <section>
      <p className="text-sm font-medium uppercase tracking-wider text-blue-400">
        Progress
      </p>

      <h1 className="mt-2 text-3xl font-bold text-white">
        Workout History
      </h1>

      <p className="mt-2 max-w-2xl text-slate-400">
        Review your completed workouts, weights, reps, and timed sets.
      </p>

      <WorkoutHistory />
    </section>
  );
}
