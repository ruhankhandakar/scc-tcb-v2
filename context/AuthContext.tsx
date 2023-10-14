import { useRootNavigation, useRouter, useSegments } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';

import { appwrite } from 'lib/appwrite-service';

interface SignInResponse {
  data: Models.Token | undefined;
  error: Error | undefined;
}

interface VerifyOtpResponse {
  data: Models.Session | undefined;
  error: Error | undefined;
}

interface SignOutResponse {
  error: any | undefined;
  data: {} | undefined;
}

interface AuthContextValue {
  signIn: (number: string) => Promise<SignInResponse>;
  signOut: () => Promise<SignOutResponse>;
  verifyOtp: (otp: string, userId: string) => Promise<VerifyOtpResponse>;
  user: Models.User<Models.Preferences> | null;
  authInitialized: boolean;
}

interface ProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function Provider(props: ProviderProps) {
  const [user, setAuth] =
    React.useState<Models.User<Models.Preferences> | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);

  const useProtectedRoute = (user: Models.User<Models.Preferences> | null) => {
    const segments = useSegments();
    const router = useRouter();

    const [isNavigationReady, setNavigationReady] = useState(false);
    const rootNavigation = useRootNavigation();

    useEffect(() => {
      const unsubscribe = rootNavigation?.addListener('state', (event) => {
        setNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rootNavigation]);

    React.useEffect(() => {
      if (!isNavigationReady) {
        return;
      }

      const inAuthGroup = segments[0] === '(auth)';

      if (!authInitialized) return;

      if (!user && !inAuthGroup) {
        router.push('/sign-in');
      } else if (user && inAuthGroup) {
        router.push('/(tabs)/home');
      }
    }, [user, segments, authInitialized, isNavigationReady]);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await appwrite.account.get();
        setAuth(user);
      } catch (error) {
        setAuth(null);
      }
      setAuthInitialized(true);
    })();
  }, []);

  const logout = async (): Promise<SignOutResponse> => {
    try {
      const response = await appwrite.account.deleteSession('current');
      return { error: undefined, data: response };
    } catch (error) {
      return { error, data: undefined };
    } finally {
      setAuth(null);
    }
  };

  const login = async (number: string): Promise<SignInResponse> => {
    try {
      const sessionToken = await appwrite.account.createPhoneSession(
        appwrite.ID.unique(),
        number
      );

      return { data: sessionToken, error: undefined };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: undefined };
    }
  };

  const verifyOtp = async (otp: string, userId: string) => {
    try {
      const session = await appwrite.account.updatePhoneSession(userId, otp);
      return { data: session, error: undefined };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: undefined };
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: login,
        signOut: logout,
        verifyOtp,
        user,
        authInitialized,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return authContext;
};
