import { TLearnedFilter, Word } from "@/types/types";

export const getFilteredWords = (
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


export const shuffleWords = (words: Word[]): Word[] => {
  const shuffled = [...words];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};