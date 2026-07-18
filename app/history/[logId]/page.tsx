type HistoryDetailPageProps = {
  params: Promise<{
    logId: string;
  }>;
};

export default async function HistoryDetailPage({
  params,
}: HistoryDetailPageProps) {
  const { logId } = await params;

  return (
    <section>
      <p className='text-sm font-medium uppercase tracking-wider text-blue-400'>
        Workout Details
      </p>

      <h1 className='mt-2 text-3xl font-bold text-white'>
        Workout Log
      </h1>

      <p className='mt-2 text-slate-400'>
        Log ID: {logId}
      </p>
    </section>
  );
}
