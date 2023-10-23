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
}

// Define the Provider component
interface ProviderProps {
  children: React.ReactNode;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: ProviderProps) {
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);

  // This hook will protect the route access based on user authentication.
  const useProtectedRoute = (user: User | null) => {
    const segments = useSegments();
    const router = useRouter();

    // checking that navigation is all good;
    const navigationState = useRootNavigationState();

    useEffect(() => {
      if (!navigationState?.key || !authInitialized) return;

      const inAuthGroup = segments[0] === '(auth)';

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace('/sign-in');
      } else if (user && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace('/(tabs)/home');
      }
    }, [user, segments, authInitialized, navigationState?.key]);
  };

  useEffect(() => {
    if (authInitialized) return;

    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setAuthInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        authInitialized,
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
