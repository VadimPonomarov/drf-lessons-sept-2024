import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AuthProvider } from '@/common/interfaces/auth.interfaces';

interface AuthProviderContextType {
  authProvider: AuthProvider;
  setAuthProvider: (provider: AuthProvider) => Promise<void>;
}

const AuthProviderContext = createContext<AuthProviderContextType | undefined>(undefined);

export const AuthProviderProvider = ({ children }: { children: ReactNode }) => {
  const [authProvider, setAuthProviderState] = useState<AuthProvider>(AuthProvider.Select);

  const setAuthProvider = useCallback(async (provider: AuthProvider) => {
    console.log('Setting auth provider in context:', provider);
    setAuthProviderState(provider);

    try {
      const response = await fetch("/api/redis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "auth_provider",
          value: provider,
          action: "set"
        }),
      });
      const data = await response.json();
      console.log('Redis update response:', data);
    } catch (error) {
      console.error("Error saving auth provider to Redis:", error);
    }
  }, []);

  return (
    <AuthProviderContext.Provider value={{ authProvider, setAuthProvider }}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export const useAuthProviderContext = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error('useAuthProviderContext must be used within an AuthProviderProvider');
  }
  return context;
};