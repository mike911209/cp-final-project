"use client"
import '@/lib/awsConfig';  
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { signUp, signIn, signOut, confirmSignUp, getCurrentUser, fetchAuthSession, AuthUser  } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { signInWithRedirect } from 'aws-amplify/auth';


interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSyncing: boolean;
  isLoading: boolean;
  error: string | null;
  // Email/Password Auth
  signUpWithEmail: (username: string, password: string, email: string) => Promise<void>;
  confirmSignUpCode: (username: string, code: string) => Promise<void>;
  signInWithEmail: (username: string, password: string) => Promise<void>;
  // Google OAuth
  signInWithGoogle: () => void;
  // General
  logout: () => Promise<void>;
  setIsSyncing: (value: boolean) => void;
  clearError: () => void;
  checkAuthState: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Convert Amplify AuthUser to our User type
  const convertAmplifyUserToUser = useCallback(async (authUser: AuthUser): Promise<User> => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    console.log('idToken', idToken);
    console.log('authUser', authUser);
    console.log('session', session);
    return {
      id: String(idToken?.payload.sub) || '',
      token: session.tokens?.idToken?.toString() || '',
      email: String(idToken?.payload.email) || '',
      deviceSerialNumber: undefined,
      googleAccessToken: session.tokens?.accessToken?.toString() || '',
      isGoogleCalendarConnected: false,
      defaultContacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }, []);

  // Check current authentication status
  const checkAuthState = useCallback(async () => {
    try {
      setIsLoading(true);
      const authUser = await getCurrentUser();
      const userData = await convertAmplifyUserToUser(authUser);
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [convertAmplifyUserToUser]);

  // Email/Password Sign Up
  const signUpWithEmail = useCallback(async (username: string, password: string, email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Confirm Sign Up with verification code
  const confirmSignUpCode = useCallback(async (username: string, code: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await confirmSignUp({
        username,
        confirmationCode: code,
      });
    } catch (err: any) {
      setError(err.message || 'Confirmation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Email/Password Sign In
  const signInWithEmail = useCallback(async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('signInWithEmail', username, password);
      const { isSignedIn } = await signIn({ username, password });
      
      if (isSignedIn) {
        await checkAuthState();
        router.push('/calendar');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Sign in failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [checkAuthState, router]);

  // Google OAuth Sign In
  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      

      await signInWithRedirect({
        provider: 'Google',
      });
      // await checkAuthState();

      
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Google sign in failed');
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut();
      setUser(null);
      router.push('/auth');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }
  }, [router]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Listen to auth events
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log('Auth event:', payload.event);
      
      switch (payload.event) {
        case 'signedIn':
          console.log('User signed in');
          checkAuthState();
          router.push('/calendar');
          break;
        case 'signedOut':
          console.log('User signed out');
          setUser(null);
          break;
        case 'tokenRefresh':
          console.log('Token refreshed');
          checkAuthState();
          break;
        case 'tokenRefresh_failure':
          console.log('Token refresh failed');
          setError('Session expired. Please sign in again.');
          setUser(null);
          break;
        case 'signInWithRedirect':
          console.log('Sign in with redirect');
          checkAuthState();
          break;
        case 'signInWithRedirect_failure':
          console.log('Sign in with redirect failed');
          setError('OAuth sign in failed. Please try again.');
          break;
      }
    });

    // Check initial auth state
    checkAuthState();

    return unsubscribe;
  }, [checkAuthState, router]);

  const value = {
    user,
    isAuthenticated: !!user,
    isSyncing,
    isLoading,
    error,
    signUpWithEmail,
    confirmSignUpCode,
    signInWithEmail,
    signInWithGoogle,
    logout,
    setIsSyncing,
    clearError,
    checkAuthState,
  };
  console.log('UserContext', value);
  console.log('user', user);

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