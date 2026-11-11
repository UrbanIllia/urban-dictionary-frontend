'use client';

import { getFilteredWords, shuffleWords } from '@/lib/api/helpers/helpers';
import { ApiError, getWords, updateWord } from '@/lib/api/words';
import { TLearnedFilter, Word } from '@/types/types';
import { useEffect, useState } from 'react';
import NoWordsYet from './no-words-yet';
import NoWordsFilter from './no-words-filter';
import TrainingFilters from './training-filters';
import IsLoaded from './is-loaded';
import TrainingWindow from './training-window';

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
  }, [currentWord?.id, currentWord]);

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
    return <IsLoaded />;
  }

  if (words.length === 0) {
    return <NoWordsYet />;
  }

  if (!currentWord) {
    return <NoWordsFilter />;
  }

  return (
    <main className="mx-auto w-4/5 space-y-4 bg-zinc-400 p-4 sm:space-y-6 sm:p-6 md:w-3/4 xl:w-1/2">
      <TrainingFilters
        learnedFilter={learnedFilter}
        onLearnedFilterChange={handleLearnedFilterChange}
        filterIt={filterIt}
        onItFilterChange={handleItFilterChange}
        filterVerb={filterVerb}
        onVerbFilterChange={handleVerbFilterChange}
        filteredWordsCount={filteredWords.length}
        engUkr={engUkr}
        toggleEngUkr={() => setEngUkr((prev) => !prev)}
      />

      <TrainingWindow
        engUkr={engUkr}
        currentWord={currentWord}
        timeLeft={timeLeft}
        isTranslationVisible={isTranslationVisible}
        setIsTranslationVisible={setIsTranslationVisible}
      />

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
              className="h-8 w-8 cursor-pointer accent-green-500"
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
