export interface Word {
  id: number;
  word: string;
  translation: string;
  learned: boolean;
  it: boolean;
  irregularVerb: boolean;
  createdAt: string;
}

export type TLearnedFilter = 'all' | 'learned' | 'notLearned';

export const defaultWordValue = {
  word: '',
  translation: '',
  learned: false,
  it: false,
  irregularVerb: false,
};

export const LEARNED_OPTONS: {
  value: TLearnedFilter;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'learned', label: 'Learned' },
  { value: 'notLearned', label: 'Not learned' },
];
export type TDatePeriod =
  | '2days'
  | 'week'
  | '2weeks'
  | 'month'
  | 'all'
  | 'custom';

export const periods = [
  { value: '2days', label: '2 days', days: 1 },
  { value: 'week', label: '1 week', days: 6 },
  { value: '2weeks', label: '2 weeks', days: 13 },
  { value: 'month', label: '1 month' },
  { value: 'all', label: 'All time' },
] as const;
