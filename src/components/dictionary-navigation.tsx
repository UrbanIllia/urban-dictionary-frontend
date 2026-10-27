'use client';

import { useAuth } from '@/context/auth-context';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DictionaryNavigation = () => {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const links = [
    { href: '/home', label: 'Home' },
    { href: '/dictionary', label: 'Dictionary' },
    { href: '/training', label: 'Training' },
  ];

  if (isLoading || !user) return null;

  return (
    <nav className={clsx('flex flex-row gap-5 text-lg font-medium', 'md:w-63')}>
      {links.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'transition-all py-6 text-black relative',
              isActive
                ? 'font-semibold bg-zinc-300'
                : 'hover:after:bg-zinc-500 hover:after:content-[""] hover:after:w-10 hover:after:h-1 hover:after:block hover:after:transition-all hover:after:ease-in-out hover:after:duration-300 hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2'
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default DictionaryNavigation;
