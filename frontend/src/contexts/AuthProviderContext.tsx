import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthProvider } from '@/common/interfaces/auth.interfaces';

interface AuthProviderContextType {
  authProvider: AuthProvider;
  setAuthProvider: (provider: AuthProvider) => void;
}

const AuthProviderContext = createContext<AuthProviderContextType | undefined>(undefined);

export const AuthProviderProvider = ({ children }: { children: ReactNode }) => {
  const [authProvider, setAuthProvider] = useState<AuthProvider>(AuthProvider.Select);

  return (
    <AuthProviderContext.Provider value={{ authProvider, setAuthProvider }}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export const useAuthProviderContext = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error('useAuthProviderContext must be used within a AuthProviderProvider');
  }
  return context;
};