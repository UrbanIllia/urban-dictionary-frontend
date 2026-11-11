import { LEARNED_OPTONS, TDatePeriod, TLearnedFilter } from '@/types/types';
import DateRangeFilter from './date-range-filter';

interface WordFiltersProps {
  learnedFilter: TLearnedFilter;
  onLearnedFilterChange: (value: TLearnedFilter) => void;
  onItFilterChange: (value: boolean) => void;
  onVerbFilterChange: (value: boolean) => void;
  filterIt: boolean;
  filterVerb: boolean;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  period: TDatePeriod;
  onPeriodChange: (value: TDatePeriod) => void;
}

const WordFilters = ({
  learnedFilter,
  onLearnedFilterChange,
  filterIt,
  onItFilterChange,
  filterVerb,
  onVerbFilterChange,
  from,
  to,
  onFromChange,
  onToChange,
  period,
  onPeriodChange,
}: WordFiltersProps) => {
  return (
    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-center">
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
              onChange={() => onLearnedFilterChange(option.value)}
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
      </div>
      <div>
        <DateRangeFilter
          from={from}
          period={period}
          to={to}
          onPeriodChange={onPeriodChange}
          onFromChange={onFromChange}
          onToChange={onToChange}
        />
      </div>
    </div>
  );
};
export default WordFilters;
