'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { BodyWeightEntry } from '@/types/bodyWeight';

type BodyWeightChartProps = {
  entries: BodyWeightEntry[];
};

export default function BodyWeightChart({
  entries,
}: BodyWeightChartProps) {
  const chartData = [...entries]
    .reverse()
    .map((entry) => ({
      date: new Date(`${entry.date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      weight: entry.weight,
    }));

  if (chartData.length < 2) {
    return (
      <p className='mt-5 text-sm text-slate-400'>
        Save at least two weigh-ins to display a weight trend.
      </p>
    );
  }

  return (
    <div className='mt-5 h-72 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' stroke='#334155' />

          <XAxis
            dataKey='date'
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            tickLine={{ stroke: '#475569' }}
          />

          <YAxis
            domain={['dataMin - 5', 'dataMax + 5']}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            tickLine={{ stroke: '#475569' }}
            width={45}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#020617',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#cbd5e1' }}
            formatter={(value) => [`${value} lbs`, 'Weight']}
          />

          <Line
            type='monotone'
            dataKey='weight'
            stroke='#3b82f6'
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
