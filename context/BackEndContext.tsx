import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { Snackbar } from 'react-native-paper';
import { Session, User } from '@supabase/supabase-js';
import { useSegments, useRouter } from 'expo-router';

import { supabase } from 'lib/supabase';

type AuthParams = {
  email: string;
  password: string;
};
type StateType = {
  loading: boolean;
  user: User | null;
};
type ContextType = {
  state: StateType;
  actions: {
    signUpWithEmail: ({ email, password }: AuthParams) => void;
  };
};

const initialState: StateType = {
  loading: false,
  user: null,
};

export const BackEndContext = createContext<ContextType | null>(null);

const BackEndContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setState((prevState) => ({
        ...prevState,
        user: session ? session.user : null,
      }));
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.push('/sign-in');
    } else if (session) {
      router.push('/(tabs)/home');
    }
  }, [session, initialized]);

  /* ----------Actions ------------- */
  const signUpWithEmail = async ({ email, password }: AuthParams) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setState((prevState) => ({
      ...prevState,
      loading: false,
    }));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const actions = {
    signUpWithEmail,
    signOut,
  };

  return (
    <BackEndContext.Provider value={{ state, actions }}>
      {children}
      {!!errorMessage && (
        <Snackbar
          visible={!!errorMessage}
          onDismiss={() => {
            setErrorMessage('');
          }}
          action={{
            label: 'Close',
            onPress: () => {
              setErrorMessage('');
            },
          }}
        >
          {errorMessage}
        </Snackbar>
      )}
    </BackEndContext.Provider>
  );
};

export const useBackEndContext = () =>
  useContext(BackEndContext) as ContextType;

export default BackEndContextProvider;
