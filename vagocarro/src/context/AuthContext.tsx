import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { supabase } from '../services/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSupabaseConfigured = Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Motorista',
          email: session.user.email || '',
          role: 'driver',
          rating: 4.96,
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Motorista',
          email: session.user.email || '',
          role: 'driver',
          rating: 4.96,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return false;
    }

    try {
      if (isSupabaseConfigured) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : authError.message);
          setIsLoading(false);
          return false;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0].toUpperCase(),
            email: data.user.email || email,
            role: 'driver',
            rating: 4.96,
          });
        }
      } else {
        // Mock fallback if keys not filled in .env yet
        await new Promise((r) => setTimeout(r, 600));
        setUser({
          id: 'driver_mock',
          name: email.split('@')[0].toUpperCase(),
          email,
          role: 'driver',
          rating: 4.96,
        });
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Erro ao conectar. Verifique sua conexão.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return false;
    }

    try {
      if (isSupabaseConfigured) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: 'driver',
            },
          },
        });

        if (authError) {
          setError(authError.message);
          setIsLoading(false);
          return false;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            name: name.trim(),
            email: data.user.email || email,
            role: 'driver',
            rating: 5.0,
          });
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setUser({
          id: `driver_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          role: 'driver',
          rating: 5.0,
        });
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar conta.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
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
