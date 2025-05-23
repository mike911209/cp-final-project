"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';



interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSyncing: boolean;
  login: (user: User) => void;
  logout: () => void;
  setIsSyncing: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/auth');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isSyncing,
    login,
    logout,
    setIsSyncing,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 