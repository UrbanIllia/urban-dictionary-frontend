'use client';

import { Word } from '@/types/types';
import clsx from 'clsx';
import { SquarePen, Trash } from 'lucide-react';

interface WordsTableProps {
  words: Word[];
  onDelete: (id: number) => void;
  onToggleLearned: (id: number) => void;
  onToggleIt: (id: number) => void;
  onEdit: (id: number) => void;
  query: string;
}

function WordsTable({
  words,
  onDelete,
  onToggleLearned,
  onToggleIt,
  query,
  onEdit,
}: WordsTableProps) {
  if (!words.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        {query.trim()
          ? 'No matching words found.'
          : 'No words yet. Add your first word above.'}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        {words.length}
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="w-[40%] px-4 py-3 text-sm font-semibold text-gray-700">
                Word
              </th>

              <th className="w-[40%] px-4 py-3 text-sm font-semibold text-gray-700">
                Translation
              </th>

              <th className="w-[7%] px-4 py-3 text-sm font-semibold text-gray-700">
                Learned
              </th>
              <th className="w-[7%] px-4 py-3 text-sm font-semibold text-gray-700">
                It
              </th>

              <th className="w-[6%] px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {words.map((word) => (
              <tr
                key={word.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-100"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {word.word}
                </td>

                <td className="px-4 py-3 text-gray-600">{word.translation}</td>

                <td
                  className={clsx(
                    'px-4 py-3 text-center',
                    word.learned && 'border-l-5 border-yellow-200'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={word.learned}
                    onChange={() => onToggleLearned(word.id)}
                    className="h-5 w-5 cursor-pointer accent-yellow-500"
                  />
                </td>
                <td
                  className={clsx(
                    'pl-4  pr-8 py-3 text-center',
                    word.it && 'border-l-5 border-red-300'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={word.it || false}
                    onChange={() => onToggleIt(word.id)}
                    className="h-5 w-5 cursor-pointer accent-red-500"
                  />
                </td>

                <td className="px-4 py-3 text-right flex flex-row border-l border-gray-300">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(word.id);
                    }}
                    className="mr-3 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:scale-120 transition-all"
                  >
                    <SquarePen />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(word.id)}
                    className="text-sm font-medium text-red-500 hover:text-red-700 cursor-pointer hover:scale-120 transition-all"
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WordsTable;
