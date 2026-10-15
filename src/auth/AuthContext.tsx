import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'EDITOR';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  changeEmail: (currentPassword: string, newEmail: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gm_admin_token') || null;
    }
    return null;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gm_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verify backend session on mount or when token changes
  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('gm_admin_user', JSON.stringify(data.user));
        } else {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem('gm_admin_token');
          localStorage.removeItem('gm_admin_user');
        }
      } catch (e) {
        console.warn('Backend session verification offline or fallback', e);
        // If server is not responding, keep user if exists or reset
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('gm_admin_token', data.token);
        localStorage.setItem('gm_admin_user', JSON.stringify(data.user));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: data.error || 'Identifiants invalides.' };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Erreur réseau lors de la connexion au serveur.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('gm_admin_token');
      localStorage.removeItem('gm_admin_user');
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return { success: true, message: data.message };
    } catch {
      return { success: true, message: 'Demande enregistrée.' };
    }
  };

  const resetPassword = async (tkn: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tkn, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Erreur lors de la réinitialisation.' };
    }
  };

  const changeEmail = async (currentPassword: string, newEmail: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!token) return { success: false, error: 'Non authentifié.' };
    try {
      const res = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (user) {
          const updated = { ...user, email: data.newEmail || newEmail.trim().toLowerCase() };
          setUser(updated);
          localStorage.setItem('gm_admin_user', JSON.stringify(updated));
        }
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Erreur lors du changement d\'adresse e-mail.' };
    } catch (err: any) {
      return { success: false, error: 'Erreur réseau lors de la communication avec le serveur.' };
    }
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Admin has full access
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      forgotPassword,
      resetPassword,
      changeEmail,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
