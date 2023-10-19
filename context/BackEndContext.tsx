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
import { Customer, IWards } from 'types';

type CustomerParams = {
  startOffset?: number;
  endOffset?: number;
  searchTerm?: string;
  column?: string;
};
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
    getTotalCustomers: () => Promise<number>;
    getCustomers: ({
      startOffset,
      endOffset,
    }: CustomerParams) => Promise<Customer[]>;
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
    const { error, data } = await supabase
      .from('wards')
      .select('*, profiles (*)')
      .eq('profiles.is_active', true)
      .eq('is_active', true)
      .eq('profiles.user_role', 'DEALER')
      .order('id', {
        ascending: true,
      });

    if (error) {
      setErrorMessage(error.message);
      return [];
    } else {
      const wards = data as IWards[];
      return wards;
    }
  };

  const getTotalCustomers = async () => {
    const userRole = state.profile?.user_role || 'DEALER';

    let query = supabase
      .from('customers')
      .select('id', { count: 'planned', head: true });

    if (userRole !== 'ADMIN') {
      query = query.eq('ward', state.profile?.ward);
    }
    const { count, error } = await query;

    if (error) {
      setErrorMessage(error.message);
    }

    return count || 0;
  };

  const getCustomers = async ({
    startOffset,
    endOffset,
    column,
    searchTerm,
  }: CustomerParams) => {
    const userRole = state.profile?.user_role || 'DEALER';

    let customers: Customer[] = [];

    let query = supabase.from('customers').select('*, wards (*)').order('id', {
      ascending: true,
    });

    if (userRole !== 'ADMIN') {
      query = query.eq('ward', state.profile?.ward);
    }

    if (endOffset) {
      query = query.range(startOffset!, endOffset);
    }

    if (searchTerm?.trim() && column) {
      query = query.ilike('customer_search', `%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) {
      setErrorMessage(error.message);
    } else {
      customers = data as Customer[];
    }
    return customers;
  };

  const actions = {
    signUpWithEmail,
    signOut,
    getWards,
    getCustomers,
    getTotalCustomers,
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
