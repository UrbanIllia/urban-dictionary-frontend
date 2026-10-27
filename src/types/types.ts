export interface Word {
  id: number;
  word: string;
  translation: string;
  learned: boolean;
  it: boolean;
}

export type TLearnedFilter = 'all' | 'learned' | 'notLearned';
