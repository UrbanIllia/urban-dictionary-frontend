import { SquareChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NoWordsYet = () => {
  const router = useRouter();
  return (
    <main className="mx-auto w-3/4 md:w-2/4 p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center sm:p-10">
        <h1 className="text-xl font-semibold text-gray-800">No words yet</h1>

        <p className="mt-2 text-gray-800">
          Add some words to your dictionary first.
        </p>

        <button
          type="button"
          onClick={() => router.push('/')}
          aria-label="Back to dictionary"
          className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-gray-800 p-4 transition hover:bg-zinc-500 hover:text-white"
        >
          <SquareChevronLeft size={44} color="#000000" />
        </button>
      </div>
    </main>
  );
};

export default NoWordsYet;
