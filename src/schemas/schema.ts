import { z } from 'zod';

export const wordSchema = z.object({
  word: z.string().min(1, 'Введите слово'),
  translation: z.string().min(1, 'Введите перевод'),
  learned: z.boolean(),
  it: z.boolean(),
});

export type TWordForm = z.infer<typeof wordSchema>;
