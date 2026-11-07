'use client';

import { TWordForm, wordSchema } from '@/schemas/schema';
import { defaultWordValue, Word } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddNewWordProps {
  onAdd: (
    word: Pick<
      Word,
      'word' | 'translation' | 'learned' | 'it' | 'irregularVerb'
    >
  ) => Promise<void>;
  onQueryChange: (value: string) => void;
  onQueryWordChange: (value: TWordForm) => void;
}

function AddNewWord({
  onAdd,
  onQueryChange,
  onQueryWordChange,
}: AddNewWordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<TWordForm>({
    resolver: zodResolver(wordSchema),
    defaultValues: defaultWordValue,
  });

  useEffect(() => {
    const subscription = watch(() => {
      onQueryWordChange(getValues());
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues, onQueryWordChange]);
  const onSubmit = async (data: TWordForm) => {
    try {
      await onAdd({
        word: data.word,
        translation: data.translation,
        learned: data.learned,
        it: data.it,
        irregularVerb: data.irregularVerb,
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
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Add something new, or filter from what you already have
      </h2>

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
        <div className="flex flex-row gap-8 md:gap-3 xl:gap-4 justify-center">
          {' '}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="learned"
              className="mb-1 block text-sm font-medium text-gray-700 text-center"
            >
              Learned
            </label>
            <input
              type="checkbox"
              {...register('learned')}
              id="learned"
              className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 cursor-pointer accent-yellow-500"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="it"
              className="mb-1 block text-sm font-medium text-gray-700 text-center"
            >
              It
            </label>
            <input
              type="checkbox"
              {...register('it')}
              id="it"
              className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 cursor-pointer accent-red-500"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="verb"
              className="mb-1 block text-sm font-medium text-gray-700 text-center"
            >
              IrrVerbs
            </label>
            <input
              type="checkbox"
              {...register('irregularVerb')}
              id="verb"
              className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 cursor-pointer accent-green-500"
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
