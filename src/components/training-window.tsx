import { Word } from "@/types/types"

interface TrainingWindowProps {
    engUkr: boolean
    currentWord: Word
    timeLeft: number
    isTranslationVisible: boolean
    setIsTranslationVisible: (value: boolean) => void
}

const TrainingWindow = ({
  engUkr,
  currentWord,
  timeLeft,
  isTranslationVisible,
  setIsTranslationVisible,
}: TrainingWindowProps) => {
  return (
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
  );
};

export default TrainingWindow