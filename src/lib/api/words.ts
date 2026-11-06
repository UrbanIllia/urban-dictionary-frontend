import { Word } from '@/types/types';
import { notifyUnauthorized } from './auth-events';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

if (!response.ok) {
  if (response.status === 401) {
    notifyUnauthorized();
  }

  throw new ApiError(`API request failed: ${response.status}`, response.status);
}

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getWords(): Promise<Word[]> {
  return request<Word[]>('/api/words');
}

export function createWord(
  data: Pick<Word, 'word' | 'translation'> &
    Partial<Pick<Word, 'learned' | 'it' | 'irregularVerb'>>
): Promise<Word> {
  return request<Word>('/api/words', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateWord(
  id: number,
  data: Pick<Word, 'word' | 'translation' | 'learned' | 'it' | 'irregularVerb'>
): Promise<Word> {
  return request<Word>(`/api/words/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteWord(id: number): Promise<void> {
  return request<void>(`/api/words/${id}`, {
    method: 'DELETE',
  });
}
