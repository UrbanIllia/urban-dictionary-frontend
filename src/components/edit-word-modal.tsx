'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/types';
import { X } from 'lucide-react';

interface IEditWordModalProps {
  word: Word;
  onSave: (
    id: number,
    updatedWord: Pick<Word, 'word' | 'translation'>
  ) => Promise<void>;
  onClose: () => void;
}

function EditWordModal({ word, onSave, onClose }: IEditWordModalProps) {
  const [englishWord, setEnglishWord] = useState(word.word);
  const [translation, setTranslation] = useState(word.translation);

  useEffect(() => {
    setEnglishWord(word.word);
    setTranslation(word.translation);
  }, [word]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedWord = englishWord.trim();
    const trimmedTranslation = translation.trim();

    if (!trimmedWord || !trimmedTranslation) {
      return;
    }

    try {
      await onSave(word.id, {
        word: trimmedWord,
        translation: trimmedTranslation,
      });

      onClose();
    } catch {
      // Ошибка уже обработана в Dictionary.
      // Оставляем модальное окно открытым.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-3xl space-y-8 rounded-xl bg-white p-12 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-gray-800">Edit word</h2>

        <div className="space-y-1">
          <label
            htmlFor="english-word"
            className="text-sm font-medium text-gray-700"
          >
            English word
          </label>

          <input
            id="english-word"
            value={englishWord}
            onChange={(event) => setEnglishWord(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-5 py-4 text-lg text-gray-800 outline-none focus:border-blue-500"
            autoFocus
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="word-translation"
            className="text-sm font-medium text-gray-700"
          >
            Translation
          </label>

          <input
            id="word-translation"
            value={translation}
            onChange={(event) => setTranslation(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-5 py-4 text-lg text-gray-800 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 cursor-pointer"
          >
            Save changes
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex justify-center items-center text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X />
        </button>
      </form>
    </div>
  );
}

export default EditWordModal;
