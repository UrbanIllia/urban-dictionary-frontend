import { LEARNED_OPTONS, TLearnedFilter } from '@/types/types';

interface TrainingFiltersProps {
  learnedFilter: TLearnedFilter;
  onLearnedFilterChange: (value: TLearnedFilter) => void;
  onItFilterChange: (value: boolean) => void;
  onVerbFilterChange: (value: boolean) => void;
  toggleEngUkr: () => void;
  filterIt: boolean;
  filterVerb: boolean;
  filteredWordsCount: number;
  engUkr: boolean;
}

const TrainingFilters = ({
  learnedFilter,
  onLearnedFilterChange,
  filterIt,
  onItFilterChange,
  filterVerb,
  filteredWordsCount,
  toggleEngUkr,
  engUkr,
  onVerbFilterChange,
}: TrainingFiltersProps) => {
  return (
    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Training</h1>

      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-gray-200 bg-white p-4">
        <span className="font-semibold text-gray-900">Learned:</span>

        {LEARNED_OPTONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name="learnedFilter"
              checked={learnedFilter === option.value}
              onChange={() =>
                onLearnedFilterChange(option.value as TLearnedFilter)
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
            onChange={(event) => onItFilterChange(event.target.checked)}
            className="h-5 w-5 cursor-pointer accent-red-500"
          />

          <span className="text-gray-900">IT</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filterVerb}
            onChange={(event) => onVerbFilterChange(event.target.checked)}
            className="h-5 w-5 cursor-pointer accent-green-500"
          />

          <span className="text-gray-900">IrrVerb</span>
        </label>

        <span className="text-sm text-gray-500">
          {filteredWordsCount} words
        </span>
      </div>

      <button
        type="button"
        onClick={() => toggleEngUkr()}
        className="flex cursor-pointer flex-row items-center justify-center transition-all hover:scale-105 hover:text-black"
      >
        {engUkr ? 'Ukrainian → English' : 'English → Ukrainian'}
      </button>
    </div>
  );
};
export default TrainingFilters;
