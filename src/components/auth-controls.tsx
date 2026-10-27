'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { logout } from '@/lib/api/auth';

export default function AuthControls() {
  const { user, isLoading, setUser } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-black xl:text-2xl md:text-lg sm:text-sm hover:scale-105 transition cursor-pointer"
        >
          Login
        </Link>
        <Link
          href="/login?register=true"
          className="text-black xl:text-2xl md:text-lg sm:text-sm hover:scale-105 transition cursor-pointer"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 flex-col md:flex-row">
      <span className="text-sm md:text-lg xl:text-xl text-black border border-black rounded-lg p-2 text-center">
        Welcome, {user.name}!
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="text-black xl:text-2xl md:text-lg sm:text-sm hover:scale-105 transition cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
