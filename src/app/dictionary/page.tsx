'use client';

import AddNewWord from '@/components/add-new-word';
import EditWordModal from '@/components/edit-word-modal';
import ProtectedRoute from '@/components/protected-route';
import WordsTable from '@/components/word-table';
import {
  ApiError,
  createWord,
  deleteWord,
  getWords,
  updateWord,
} from '@/lib/api/words';
import { TWordForm } from '@/schemas/schema';
import { defaultWordValue, Word } from '@/types/types';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Dictionary() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queryWord, setqueryWord] = useState<TWordForm>(defaultWordValue);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log('queryWord', queryWord);
  useEffect(() => {
    const loadWords = async () => {
      try {
        const data = await getWords();
        setWords(data);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return;
        }

        console.error('Failed to load words:', error);
        toast.error('Failed to load words');
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  const allWords = JSON.stringify(words);

  const handleEditWord = async (
    id: number,
    updatedWord: Pick<Word, 'word' | 'translation'>
  ): Promise<void> => {
    const currentWord = words.find((word) => word.id === id);

    if (!currentWord) return;

    try {
      const savedWord = await updateWord(id, {
        ...currentWord,
        ...updatedWord,
      });

      setWords((prev) =>
        prev.map((word) => (word.id === id ? savedWord : word))
      );

      toast.success('Word updated successfully!');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }

      console.error('Failed to update word:', error);
      toast.error('Failed to update word');
      throw error;
    }
  };

  const handleAddWord = async (
    word: Pick<
      Word,
      'word' | 'translation' | 'learned' | 'it' | 'irregularVerb'
    >
  ): Promise<void> => {
    try {
      const newWord = await createWord(word);

      setWords((prev) => [newWord, ...prev]);
      setQuery('');
      toast.success('Word added successfully!');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }

      console.error('Failed to add word:', error);
      toast.error('Failed to add word');
      throw error;
    }
  };

  const handleDeleteWord = async (id: number) => {
    try {
      await deleteWord(id);

      setWords((prev) => prev.filter((word) => word.id !== id));

      toast.success('Word deleted successfully!');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }

      console.error('Failed to delete word:', error);
      toast.error('Failed to delete word');
    }
  };

  const handleToggleLearned = async (id: number) => {
    const currentWord = words.find((word) => word.id === id);

    if (!currentWord) return;

    try {
      const updatedWord = await updateWord(id, {
        ...currentWord,
        learned: !currentWord.learned,
      });

      setWords((prev) =>
        prev.map((word) => (word.id === id ? updatedWord : word))
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }

      console.error('Failed to update learned status:', error);
      toast.error('Failed to update learned status');
    }
  };

  const handleToggleIrrVerb = async (id: number) => {
    const currentWord = words.find((word) => word.id === id);

    if (!currentWord) return;

    try {
      const updatedWord = await updateWord(id, {
        ...currentWord,
        irregularVerb: !currentWord.irregularVerb,
      });

      setWords((prev) =>
        prev.map((word) => (word.id === id ? updatedWord : word))
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }

      console.error('Failed to update irregular verb status:', error);
      toast.error('Failed to update irregular verb status');
    }
  };
  const handleToggleIt = async (id: number) => {
    const currentWord = words.find((word) => word.id === id);

    if (!currentWord) return;

    try {
      const updatedWord = await updateWord(id, {
        ...currentWord,
        it: !currentWord.it,
      });

      setWords((prev) =>
        prev.map((word) => (word.id === id ? updatedWord : word))
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }

      console.error('Failed to update it status:', error);
      toast.error('Failed to update it status');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(allWords);
      toast.success('Downloaded, you can paste it!');
    } catch (err) {
      console.error('Не удалось скопировать', err);
    }
  };


  const filteredWords = words.filter((word) => {
    const matchesWord = word.word
      .toLowerCase()
      .includes(queryWord.word.trim().toLowerCase());

    const matchesLearned = !queryWord.learned || word.learned;
    const matchesIt = !queryWord.it || word.it;
    const matchesIrregularVerb = !queryWord.irregularVerb || word.irregularVerb;

    return matchesWord && matchesLearned && matchesIt && matchesIrregularVerb;
  });

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full space-y-6 p-4 sm:p-6 lg:w-3/4">
        <div>
          <h1 className="text-2xl font-bold text-gray-400">My Dictionary</h1>

          <p className="mt-1 text-sm text-gray-500">
            Add and manage your English words, phrases, and expressions.
          </p>
        </div>

        <AddNewWord
          onAdd={handleAddWord}
          onQueryChange={setQuery}
          onQueryWordChange={setqueryWord}
        />

        <h2 className="text-3xl font-bold text-gray-300">Words and Phrases</h2>
        <div className="flex flex-row justify-between items-center">
          <p>
            Total quantity:{' '}
            <span className="text-xl font-bold">{words.length}</span>
          </p>
          <div>
            <p>Learned: {words.filter((word) => word.learned).length}</p>
            <p>
              Irregular verbs:{' '}
              {words.filter((word) => word.irregularVerb).length}
            </p>
            <p>It: {words.filter((word) => word.it).length}</p>
          </div>
        </div>

        <WordsTable
          words={filteredWords}
          isLoading={isLoading}
          onDelete={handleDeleteWord}
          onToggleLearned={handleToggleLearned}
          onToggleIt={handleToggleIt}
          onToggleIrrVerb={handleToggleIrrVerb}
          onEdit={(id) => {
            const word = words.find((word) => word.id === id);
            console.log('Edit clicked:', id);
            if (word) {
              setEditingWord(word);
            }
          }}
          query={query}
        />
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex flex-row justify-center items-center gap-20">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              {isOpen ? 'Close something' : 'Open something'}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Download
            </button>
          </div>

          {isOpen && (
            <div>
              <p>{allWords}</p>
            </div>
          )}
        </div>
        {editingWord && (
          <EditWordModal
            word={editingWord}
            onSave={handleEditWord}
            onClose={() => setEditingWord(null)}
          />
        )}
        <Toaster
          position="bottom-right"
          toastOptions={{
            success: {
              iconTheme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </main>
    </ProtectedRoute>
  );
}

export default Dictionary;
