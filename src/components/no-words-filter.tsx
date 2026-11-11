import { SquareChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NoWordsFilter = () => {
  const router = useRouter();
  return (
    <main className="mx-auto w-3/4 md:w-2/4 p-4 sm:p-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-8 flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-800">
          No words match these filters
        </h1>

        <p className="mt-2 text-gray-500">
          Try changing the filters to start a training session.
        </p>
        <button
          type="button"
          onClick={() => router.push('/training')}
          aria-label="Back to dictionary"
          className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-gray-800 p-4 transition hover:bg-zinc-500 hover:text-white"
        >
          <SquareChevronLeft size={44} color="#000000" />
        </button>
      </div>
    </main>
  );
};

export default NoWordsFilter;
