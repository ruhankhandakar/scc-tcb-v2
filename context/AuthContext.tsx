import { Session, User } from '@supabase/supabase-js';
import {
  useRootNavigation,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import React, { useContext, createContext, useEffect, useState } from 'react';

import { supabase } from 'lib/supabase';

interface AuthContextValue {
  session: Session | null;
  authInitialized: boolean;
  handleRefresh: () => void;
}

// Define the Provider component
interface ProviderProps {
  children: React.ReactNode;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: ProviderProps) {
  const segments = useSegments();
  const router = useRouter();

  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setAuthInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    const { data } = await supabase.auth.refreshSession();

    if (!data.session) {
      await supabase.auth.signOut();
    }
    setSession(data.session);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        authInitialized,
        handleRefresh,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Define the useAuth hook
export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return authContext;
};
