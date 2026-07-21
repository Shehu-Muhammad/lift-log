import Link from 'next/link';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/nutrition', label: 'Nutrition' },
  { href: '/meal-plan', label: 'Meal Plan' },
  { href: '/progress', label: 'Progress' },
  { href: '/history', label: 'History' },
];

export default function Navbar() {
  return (
    <header className='border-b border-slate-800 bg-slate-950'>
      <nav className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
        <Link href='/' className='text-xl font-bold text-white'>
          LiftLog
        </Link>

        <div className='flex gap-6'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm text-slate-300 transition hover:text-white'
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
