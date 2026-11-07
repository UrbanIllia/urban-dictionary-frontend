export interface Word {
  id: number;
  word: string;
  translation: string;
  learned: boolean;
  it: boolean;
  irregularVerb: boolean;
}

export type TLearnedFilter = 'all' | 'learned' | 'notLearned';


export const defaultWordValue = {
  word: '',
  translation: '',
  learned: false,
  it: false,
  irregularVerb: false,
}