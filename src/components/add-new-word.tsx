'use client';

import { TWordForm, wordSchema } from '@/schemas/schema';
import { Word } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddNewWordProps {
  onAdd: (
    word: Pick<Word, 'word' | 'translation' | 'learned' | 'it'>
  ) => Promise<void>;
  onQueryChange: (value: string) => void;
}

function AddNewWord({ onAdd, onQueryChange }: AddNewWordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TWordForm>({
    resolver: zodResolver(wordSchema),
    defaultValues: {
      word: '',
      translation: '',
      learned: false,
      it: false,
    },
  });
  const onSubmit = async (data: TWordForm) => {
    try {
      await onAdd({
        word: data.word,
        translation: data.translation,
        learned: data.learned,
        it: data.it,
      });

      reset();
    } catch (error) {
      toast.error('Failed to add word');
      console.error('Failed to add word:', error);
    }
  };
  console.log('WATCH:', watch());
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-8 sm:p-5"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Add new word</h2>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 w-full relative">
          <label
            htmlFor="word"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Word
          </label>

          <input
            id="word"
            {...register('word')}
            placeholder="English word"
            onChange={(event) => {
              const value = event.target.value;
              register('word').onChange(event);
              onQueryChange(value);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.word && (
            <p className="mt-1 text-sm text-red-500 absolute -bottom-6 left-0">
              {errors.word.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full relative">
          <label
            htmlFor="translation"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Translation
          </label>

          <input
            id="translation"
            {...register('translation')}
            placeholder="Ukrainian translation"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.translation && (
            <p className="mt-1 text-sm text-red-500 absolute -bottom-6 left-0">
              {errors.translation.message}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-2 md:gap-3 xl:gap-4">
          {' '}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="learned"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Learned
            </label>
            <input
              type="checkbox"
              {...register('learned')}
              id="learned"
              className="w-8 h-8 cursor-pointer accent-yellow-500"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="it"
              className="mb-1 block text-sm font-medium text-gray-700 "
            >
              It
            </label>
            <input
              type="checkbox"
              {...register('it')}
              id="it"
              className="w-8 h-8 cursor-pointer accent-red-500"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="cursor-pointer w-full rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
      >
        Add word
      </button>
    </form>
  );
}

export default AddNewWord;
