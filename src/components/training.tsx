'use client';

import { ApiError, getWords, updateWord } from '@/lib/api/words';
import { TLearnedFilter, Word } from '@/types/types';
import { SquareChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const shuffleWords = (words: Word[]): Word[] => {
  const shuffled = [...words];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const getFilteredWords = (
  words: Word[],
  learnedFilter: TLearnedFilter,
  filterIt: boolean,
  filterVerb: boolean
): Word[] => {
  return words.filter((word) => {
    const matchesLearned =
      learnedFilter === 'all' ||
      (learnedFilter === 'learned' && word.learned) ||
      (learnedFilter === 'notLearned' && !word.learned);

    const matchesIt = !filterIt || word.it === true;
    const matchesVerb = !filterVerb || word.irregularVerb === true;

    return matchesLearned && matchesIt && matchesVerb;
  });
};

export default function TrainingPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [sessionWordIds, setSessionWordIds] = useState<number[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  const [history, setHistory] = useState<number[]>([0]);
  const [historyPosition, setHistoryPosition] = useState(0);

  const [isTranslationVisible, setIsTranslationVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [engUkr, setEngUkr] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const [learnedFilter, setLearnedFilter] = useState<TLearnedFilter>('all');
  const [filterIt, setFilterIt] = useState(false);
  const [filterVerb, setFilterVerb] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadWords = async () => {
      try {
        const data = await getWords();

        setWords(data);

        const initialSession = shuffleWords(
          getFilteredWords(data, 'all', false, false)
        );

        setSessionWordIds(initialSession.map((word) => word.id));
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return;
        }

        console.error('Failed to load words:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadWords();
  }, []);

  const currentWordId = sessionWordIds[sessionIndex];

  const currentWord = words.find((word) => word.id === currentWordId);

  const filteredWords = getFilteredWords(
    words,
    learnedFilter,
    filterIt,
    filterVerb
  );

  const startNewSession = (
    nextLearnedFilter: TLearnedFilter,
    nextFilterIt: boolean,
    nextFilterVerb: boolean
  ) => {
    const matchingWords = getFilteredWords(
      words,
      nextLearnedFilter,
      nextFilterIt,
      nextFilterVerb
    );

    const shuffledWords = shuffleWords(matchingWords);

    setSessionWordIds(shuffledWords.map((word) => word.id));
    setSessionIndex(0);
    setHistory([0]);
    setIsSessionCompleted(false);
    setHistoryPosition(0);
    setIsTranslationVisible(false);
    setTimeLeft(15);
  };

  useEffect(() => {
    if (!currentWord) return;

    setIsTranslationVisible(false);
    setTimeLeft(15);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTranslationVisible(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentWord?.id]);

  const handleNext = () => {
    if (sessionIndex >= sessionWordIds.length - 1) {
      setIsSessionCompleted(true);
      return;
    }

    const nextIndex = sessionIndex + 1;

    const newHistory = history.slice(0, historyPosition + 1);
    newHistory.push(nextIndex);

    setHistory(newHistory);
    setHistoryPosition(newHistory.length - 1);
    setSessionIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (historyPosition === 0) return;

    const previousPosition = historyPosition - 1;
    const previousIndex = history[previousPosition];

    setHistoryPosition(previousPosition);
    setSessionIndex(previousIndex);
  };

  const handleToggleLearned = async () => {
    if (!currentWord) return;

    try {
      const updatedWord = await updateWord(currentWord.id, {
        ...currentWord,
        learned: !currentWord.learned,
      });

      setWords((prev) =>
        prev.map((word) => (word.id === currentWord.id ? updatedWord : word))
      );
    } catch (error) {
      console.error('Failed to update learned status:', error);
    }
  };
  const handleToggleVerb = async () => {
    if (!currentWord) return;

    try {
      const updatedWord = await updateWord(currentWord.id, {
        ...currentWord,
        irregularVerb: !currentWord.irregularVerb,
      });

      setWords((prev) =>
        prev.map((word) => (word.id === currentWord.id ? updatedWord : word))
      );
    } catch (error) {
      console.error('Failed to update irregular verb status:', error);
    }
  };
  const handleToggleIt = async () => {
    if (!currentWord) return;

    try {
      const updatedWord = await updateWord(currentWord.id, {
        ...currentWord,
        it: !currentWord.it,
      });

      setWords((prev) =>
        prev.map((word) => (word.id === currentWord.id ? updatedWord : word))
      );
    } catch (error) {
      console.error('Failed to update it status:', error);
    }
  };

  const handleLearnedFilterChange = (nextFilter: TLearnedFilter) => {
    setLearnedFilter(nextFilter);
    startNewSession(nextFilter, filterIt, filterVerb);
  };

  const handleItFilterChange = (nextFilterIt: boolean) => {
    setFilterIt(nextFilterIt);
    startNewSession(learnedFilter, nextFilterIt, filterVerb);
  };
  const handleVerbFilterChange = (nextFilterVerb: boolean) => {
    setFilterVerb(nextFilterVerb);
    startNewSession(learnedFilter, filterIt, nextFilterVerb);
  };

  if (!isLoaded) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 md:w-8 xl:h-10 md:h-8 xl:w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600 text-xl md:text-2xl  xl:text-4xl">
            Loading words...
          </p>
        </div>
      </main>
    );
  }

  if (words.length === 0) {
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
  }

  if (!currentWord) {
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
            onClick={() => router.back()}
            aria-label="Back to dictionary"
            className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-gray-800 p-4 transition hover:bg-zinc-500 hover:text-white"
          >
            <SquareChevronLeft size={44} color="#000000" />
          </button>
        </div>
      </main>
    );
  }

  // const isLastWord = sessionIndex >= sessionWordIds.length - 1;

  return (
    <main className="mx-auto w-4/5 space-y-4 bg-zinc-400 p-4 sm:space-y-6 sm:p-6 md:w-3/4 xl:w-1/2">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Training</h1>

        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-gray-200 bg-white p-4">
          <span className="font-semibold text-gray-900">Learned:</span>

          {[
            { value: 'all', label: 'All' },
            { value: 'learned', label: 'Learned' },
            { value: 'notLearned', label: 'Not learned' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="learnedFilter"
                checked={learnedFilter === option.value}
                onChange={() =>
                  handleLearnedFilterChange(option.value as TLearnedFilter)
                }
                className="h-5 w-5 cursor-pointer accent-yellow-500"
              />

              <span className="text-gray-900">{option.label}</span>
            </label>
          ))}

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={filterIt}
              onChange={(event) => handleItFilterChange(event.target.checked)}
              className="h-5 w-5 cursor-pointer accent-red-500"
            />

            <span className="text-gray-900">IT</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={filterVerb}
              onChange={(event) => handleVerbFilterChange(event.target.checked)}
              className="h-5 w-5 cursor-pointer accent-green-500"
            />

            <span className="text-gray-900">IrrVerb</span>
          </label>

          <span className="text-sm text-gray-500">
            {filteredWords.length} words
          </span>
        </div>

        <button
          type="button"
          onClick={() => setEngUkr((prev) => !prev)}
          className="flex cursor-pointer flex-row items-center justify-center transition-all hover:scale-105 hover:text-black"
        >
          {engUkr ? 'Ukrainian → English' : 'English → Ukrainian'}
        </button>
      </div>

      <div
        onClick={() => setIsTranslationVisible(true)}
        className="relative flex min-h-150 cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 shadow-sm transition hover:shadow-md"
      >
        <p className="text-md md:text-xl uppercase tracking-wider text-gray-400">
          Word
        </p>

        <h2 className="mt-3 text-center text-3xl font-bold text-gray-900 sm:text-5xl xl:text-6xl">
          {engUkr ? currentWord.translation : currentWord.word}
        </h2>

        <div className="mt-10 min-h-10">
          {isTranslationVisible ? (
            <p className="text-center text-2xl font-medium text-blue-600 sm:text-3xl xl:text-4xl">
              {engUkr ? currentWord.word : currentWord.translation}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-base text-gray-400 sm:text-xl md:text-2xl">
                Translation is hidden
              </p>

              <p className="mt-3 text-3xl font-semibold tabular-nums text-gray-600">
                {timeLeft}s
              </p>
            </div>
          )}
        </div>

        {currentWord.it && (
          <p className="absolute right-5 top-5 rounded-xl border border-red-500 px-4 py-2 text-2xl font-semibold text-red-600">
            IT
          </p>
        )}

        {currentWord.learned && (
          <p className="absolute left-5 top-5 rounded-xl border border-yellow-600 px-4 py-2 text-2xl font-semibold text-yellow-600">
            LEARNED
          </p>
        )}
        {currentWord.irregularVerb && (
          <p className="absolute left-1/2 translate-x-[-50%] top-5 rounded-xl border border-green-600 px-4 py-2 text-2xl font-semibold text-green-600">
            IRRVERB
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col items-center justify-center gap-4">
        <div className="mt-5 flex items-center justify-center gap-8">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={currentWord.learned}
              onChange={handleToggleLearned}
              onClick={(event) => event.stopPropagation()}
              className="h-8 w-8 cursor-pointer accent-yellow-500"
            />

            <span className="font-medium text-gray-900">Learned</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={currentWord.it ?? false}
              onChange={handleToggleIt}
              onClick={(event) => event.stopPropagation()}
              className="h-8 w-8 cursor-pointer accent-red-500"
            />

            <span className="font-medium text-gray-900">IT</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={currentWord.irregularVerb ?? false}
              onChange={handleToggleVerb}
              onClick={(event) => event.stopPropagation()}
              className="h-8 w-8 cursor-pointer accent-red-500"
            />

            <span className="font-medium text-gray-900">IrrVerb</span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={historyPosition === 0}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-xl">← </span>
          Previous
        </button>

        <span className="text-lg font-semibold text-gray-700">
          {sessionIndex + 1} / {sessionWordIds.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSessionCompleted}
          className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next <span className="text-xl">→</span>
        </button>
      </div>

      {isSessionCompleted && sessionWordIds.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="mt-5 rounded-xl border border-white/50 bg-white/70 p-4 text-center w-1/4 h-70 flex flex-col gap-10 justify-center items-center">
            <p className="font-semibold text-gray-800 text-3xl">
              Training session completed!
            </p>

            <button
              type="button"
              onClick={() =>
                startNewSession(learnedFilter, filterIt, filterVerb)
              }
              className="mt-3 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-lg font-medium text-white transition hover:bg-blue-700"
            >
              Start again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
