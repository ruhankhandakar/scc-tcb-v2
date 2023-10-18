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
import { ProfileData } from 'types/profile';
import { IWards } from 'types';

type AuthParams = {
  email: string;
  password: string;
};
type StateType = {
  loading: boolean;
  user: User | null;
  profile: ProfileData | null;
};
type ContextType = {
  state: StateType;
  actions: {
    signUpWithEmail: ({ email, password }: AuthParams) => void;
    signOut: () => void;
    getWards: () => Promise<IWards[] | undefined>;
  };
};

const initialState: StateType = {
  loading: false,
  user: null,
  profile: null,
};

export const BackEndContext = createContext<ContextType | null>(null);

const BackEndContextProvider = ({ children }: { children: ReactNode }) => {
  const segments = useSegments();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState(initialState);
  const [initialized, setInitialized] = useState(false);
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

  useEffect(() => {
    if (state.user) {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      supabase
        .from('profiles')
        .select('*')
        .eq('id', state.user?.id)
        .then((response) => {
          const { error, data } = response;

          if (error) {
            setErrorMessage(error.message);
          }

          const profileData = data as ProfileData[];

          setState((prevState) => ({
            ...prevState,
            loading: false,
            profile: profileData?.length ? profileData[0] : null,
          }));
        });
    }
  }, [state.user]);

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
      if (error.message === 'User already registered') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setErrorMessage(signInError.message);
        }
      } else {
        setErrorMessage(error.message);
      }
    }
    setState((prevState) => ({
      ...prevState,
      loading: false,
    }));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getWards = async () => {
    const { error, data } = await supabase.from('wards').select('*');
    if (error) {
      setErrorMessage(error.message);
    } else {
      const wards = data as IWards[];
      return wards;
    }
  };

  const actions = {
    signUpWithEmail,
    signOut,
    getWards,
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
