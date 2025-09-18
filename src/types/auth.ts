export interface TelegramUserBase {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramUser extends TelegramUserBase {
  last_name?: string;
  auth_date: number;
  hash: string;
}

export type UserRole = "admin" | "regular";

export interface User extends TelegramUserBase {
  telegram_id: number;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
