'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, register } from '@/lib/api/auth';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [isRegister, setIsRegister] = useState(
    searchParams.get('register') === 'true'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsRegister(searchParams.get('register') === 'true');
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isRegister && !name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (!password.trim()) {
      setError('Password cannot contain only spaces');
      return;
    }

    if (isRegister && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      await refreshUser();
      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md">
            <span className="text-2xl font-bold">W</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {isRegister ? 'Create account' : 'Welcome back'}
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            {isRegister
              ? 'Create an account to build your vocabulary.'
              : 'Log in to continue learning English.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isRegister && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-zinc-700"
              >
                Name
              </label>

              <input
                id="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="relative min-h-5">
            {error && (
              <p
                role="alert"
                className="absolute inset-x-0 top-0 text-sm leading-5 text-red-600"
              >
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-zinc-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Please wait...
              </span>
            ) : isRegister ? (
              'Create account'
            ) : (
              'Log in'
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-zinc-100 pt-5 text-center">
          <p className="text-sm text-zinc-500">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRegister((current) => !current);
              setError('');
            }}
            className="mt-2 cursor-pointer text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            {isRegister ? 'Log in instead' : 'Create an account'}
          </button>
        </div>
      </div>
    </main>
  );
}
