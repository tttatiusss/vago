export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver';
  rating: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
