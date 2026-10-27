'use client';
import clsx from 'clsx';
import Logo from './logo';
import DictionaryNavigation from './dictionary-navigation';
import AuthControls from './auth-controls';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();
  return (
    <header
      className={clsx(
        'relative flex w-full flex-row items-center justify-between gap-3 border-b border-gray-400 bg-white px-4 py-3',
        'sm:px-6 md:px-8 md:py-2',
        'xl:px-25'
      )}
    >
      <Logo />

      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <DictionaryNavigation />
        </div>
        {!isLoading && user && (
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="cursor-pointer text-black md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      <AuthControls />
      {isMenuOpen && !isLoading && user && (
        <nav className="absolute left-0 top-full z-50 flex w-full flex-col border-b border-gray-300 bg-white shadow-md md:hidden justify-center items-center">
          {[
            { href: '/home', label: 'Home' },
            { href: '/dictionary', label: 'Dictionary' },
            { href: '/training', label: 'Training' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="px-6 py-4 text-black transition hover:bg-zinc-100"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
