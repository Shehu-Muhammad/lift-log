import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'LiftLog',
  description: 'Track workouts, nutrition, and fitness progress.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-slate-950 text-white'>
        <Navbar />

        <main className='mx-auto w-full max-w-6xl px-6 py-8'>{children}</main>
      </body>
    </html>
  );
}
