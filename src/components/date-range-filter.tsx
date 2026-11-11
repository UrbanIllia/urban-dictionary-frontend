'use client';

import { periods, TDatePeriod } from "@/types/types";

interface DateRangeFilterProps {
  from: string;
  to: string;
  period: TDatePeriod;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPeriodChange: (value: TDatePeriod) => void;
}

const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getMonthAgo = (date: Date) => {
  const result = new Date(date);
  const day = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() - 1);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(day, lastDay));

  return result;
};


const DateRangeFilter = ({
  from,
  to,
  period,
  onFromChange,
  onToChange,
  onPeriodChange,
}: DateRangeFilterProps) => {
  const today = new Date();
  const todayString = getDateString(today);

  const handlePeriodChange = (value: TDatePeriod) => {
    onPeriodChange(value);

    if (value === 'all') {
      onFromChange('');
      onToChange('');
      return;
    }

    const selectedPeriod = periods.find((item) => item.value === value);

    if (value === 'month') {
      onFromChange(getDateString(getMonthAgo(today)));
    } else if (selectedPeriod && 'days' in selectedPeriod) {
      const dateFrom = new Date(today);
      dateFrom.setDate(dateFrom.getDate() - selectedPeriod.days);

      onFromChange(getDateString(dateFrom));
    }

    onToChange(todayString);
  };

  const inputClassName =
    'cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {periods.map((item) => (
          <label
            key={item.value}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-white"
          >
            <input
              type="radio"
              name="datePeriod"
              value={item.value}
              checked={period === item.value}
              onChange={() => handlePeriodChange(item.value)}
              className="h-4 w-4 cursor-pointer accent-yellow-500"
            />
            {item.label}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="date-from" className="text-sm font-semibold text-white">
          From:
        </label>

        <input
          type="date"
          id="date-from"
          value={from}
          max={to || todayString}
          onChange={(event) => {
            onPeriodChange('custom');
            onFromChange(event.target.value);
          }}
          className={inputClassName}
        />

        <label htmlFor="date-to" className="text-sm font-semibold text-white">
          To:
        </label>

        <input
          type="date"
          id="date-to"
          value={to}
          min={from || undefined}
          max={todayString}
          onChange={(event) => {
            onPeriodChange('custom');
            onToChange(event.target.value);
          }}
          className={inputClassName}
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
