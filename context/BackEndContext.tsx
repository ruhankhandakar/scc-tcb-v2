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
import { decode } from 'base64-arraybuffer';

import { supabase } from 'lib/supabase';
import { ProfileData } from 'types/profile';
import { Customer, IWards, Products, TWards } from 'types';

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
type PhoneAuthParams = {
  phone: string;
  password: string;
};
type PhoneVerifyParams = {
  phone: string;
  otp: string;
};
type StateType = {
  loading: boolean;
  user: User | null;
  profile: ProfileData | null;
  products: Products[] | null;
};
type ContextType = {
  state: StateType;
  actions: {
    signUpWithEmail: ({ email, password }: AuthParams) => void;
    signUpWithPhoneAndPassword: ({
      phone,
      password,
    }: PhoneAuthParams) => Promise<
      | {
          success: boolean;
          data?: undefined;
        }
      | {
          success: boolean;
          data: {
            user: User | null;
            session: Session | null;
          };
        }
    >;
    loginWithPhoneAndPassword: ({
      phone,
      password,
    }: PhoneAuthParams) => Promise<
      | {
          success: boolean;
          data?: undefined;
        }
      | {
          success: boolean;
          data: {
            user: User;
            session: Session;
          };
        }
    >;
    verifyOtp: ({ phone, otp }: PhoneVerifyParams) => Promise<
      | {
          success: boolean;
          session?: undefined;
        }
      | {
          success: boolean;
          session: Session | null;
        }
    >;
    signOut: () => void;
    getTotalCustomers: () => Promise<number>;
    getCustomers: ({
      startOffset,
      endOffset,
    }: CustomerParams) => Promise<Customer[]>;
    getWards: () => Promise<IWards[] | undefined>;
    getOnlyWards: () => Promise<TWards[] | undefined>;
    getCustomerDetails: (customerId: number) => Promise<Customer | undefined>;
    uploadFile: (
      filePath: string,
      base64: string,
      contentType: string
    ) => Promise<void>;
  };
};

const initialState: StateType = {
  loading: false,
  user: null,
  profile: null,
  products: null,
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
      router.replace('/sign-in');
    } else if (session) {
      router.replace('/(tabs)/home');
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

  useEffect(() => {
    if (
      state.profile?.user_role === 'ADMIN' ||
      state.profile?.user_role === 'DEALER'
    ) {
      getProducts();
    }
  }, [state.profile?.user_role]);

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

  const getOnlyWards = async () => {
    const { error, data } = await supabase
      .from('wards')
      .select('*')
      .eq('is_active', true)
      .order('id', {
        ascending: true,
      });

    if (error) {
      setErrorMessage(error.message);
      return [];
    } else {
      const wards = data as TWards[];
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

  const getProducts = async () => {
    const { error, data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setState((prevState) => ({
        ...prevState,
        products: data as Products[],
      }));
    }
  };

  const getCustomerDetails = async (customerId: number) => {
    const { error, data } = await supabase
      .from('customers')
      .select('*, wards(*)')
      .eq('customer_id', customerId);

    if (error) {
      setErrorMessage(error.message);
    } else {
      return data[0] as Customer;
    }
  };

  const uploadFile = async (
    filePath: string,
    base64: string,
    contentType: string
  ) => {
    const { data, error } = await supabase.storage
      .from('public_documents')
      .upload(filePath, decode(base64), { contentType, upsert: true });

    if (data?.path) {
      const { data: response } = await supabase.storage
        .from('public_documents')
        .getPublicUrl(data.path);
      console.log('response', response);
    }

    console.log(error, data);
  };

  const signUpWithPhoneAndPassword = async ({
    phone,
    password,
  }: PhoneAuthParams) => {
    const { data, error } = await supabase.auth.signUp({
      phone,
      password,
    });
    if (error) {
      setErrorMessage(error.message);
      return {
        success: false,
      };
    } else {
      return {
        success: true,
        data,
      };
    }
  };

  const verifyOtp = async ({ phone, otp }: PhoneVerifyParams) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    if (error) {
      setErrorMessage(error.message);
      return {
        success: false,
      };
    }
    return {
      success: true,
      session: data.session,
    };
  };

  const loginWithPhoneAndPassword = async ({
    phone,
    password,
  }: PhoneAuthParams) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return {
        success: false,
      };
    }
    return {
      success: true,
      data,
    };
  };

  const actions = {
    signUpWithEmail,
    signOut,
    getWards,
    getOnlyWards,
    getCustomers,
    getTotalCustomers,
    setErrorMessage,
    getCustomerDetails,
    uploadFile,
    signUpWithPhoneAndPassword,
    verifyOtp,
    loginWithPhoneAndPassword,
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
