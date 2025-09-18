import type { TelegramUser } from "@/types/auth";

const API_BASE_URL = "http://localhost:3345/api";

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    telegram_id: number;
    first_name: string;
    username?: string;
    role: string;
    permissions: string[];
  };
  message?: string;
}

export async function authenticateWithBackend(telegramUser: TelegramUser): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Send the complete Telegram user object for verification
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        photo_url: telegramUser.photo_url,
        auth_date: telegramUser.auth_date,
        hash: telegramUser.hash,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Backend authentication error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}

export async function makeAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('auth_token');

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
}