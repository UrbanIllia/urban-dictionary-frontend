const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthUser {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

interface AuthResponse {
  user: AuthUser;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

async function requestAuth<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  } catch {
    throw new Error('Unable to connect to server. Please try again.');
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Authentication failed';

    throw new AuthError(message, response.status);
  }

  if (data === null) {
    throw new Error('Invalid server response');
  }

  return data as T;
}

export function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  return requestAuth<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }) {
  return requestAuth<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return requestAuth<AuthResponse>('/me');
}

export function logout() {
  return requestAuth<{ message: string }>('/logout', {
    method: 'POST',
  });
}
