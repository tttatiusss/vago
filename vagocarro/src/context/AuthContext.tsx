import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!email || !password) {
        setError('Por favor, preencha todos os campos.');
        setIsLoading(false);
        return false;
      }

      const mockUser: User = {
        id: 'driver_1',
        name: email.split('@')[0].toUpperCase(),
        email,
        role: 'driver',
        rating: 4.95,
      };

      setUser(mockUser);
      setIsLoading(false);
      return true;
    } catch {
      setError('Falha ao autenticar. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        setIsLoading(false);
        return false;
      }

      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        setIsLoading(false);
        return false;
      }

      const newUser: User = {
        id: `driver_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: 'driver',
        rating: 5.0,
      };

      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch {
      setError('Falha ao criar cadastro. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        clearError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
