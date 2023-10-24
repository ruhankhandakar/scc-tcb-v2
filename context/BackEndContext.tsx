import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { Snackbar } from 'react-native-paper';
import { Session, User } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

import { supabase } from 'lib/supabase';
import { ProfileData } from 'types/profile';
import { Customer, IWards, Products, TWards } from 'types';
import { ProfileDBPayload, StoreFileInBucketParamType } from 'utils/types';
import { BUCKET_NAME, PUBLIC_BUCKET_NAME } from 'constants/supabase';

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
    getLoggedInUserProfileData: (
      userId: string
    ) => Promise<ProfileData[] | undefined>;
    signUpWithEmail: ({ email, password }: AuthParams) => void;
    downloadFile: (filePath: string) => Promise<string | undefined>;
    getPublicUrl: (filePath: string, bucketName?: string) => Promise<string>;
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
    updateState<T>(key: string, data: T | null): void;
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
    updateUserPassword: ({ phone, password }: PhoneAuthParams) => Promise<
      | {
          success: boolean;
          data?: undefined;
        }
      | {
          success: boolean;
          data: {
            user: User;
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
    storeFileInBucketAndReturnPublicUrl: ({
      fileURI,
      filePath,
      contentType,
      folderName,
      keyName,
    }: StoreFileInBucketParamType) => Promise<{
      keyName: string;
      pathName: string;
      errorMsg: string;
    }>;
    createProfile: (payload: ProfileDBPayload) => Promise<{
      success: boolean;
    }>;
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
  const [state, setState] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (
      state.profile?.user_role === 'ADMIN' ||
      state.profile?.user_role === 'DEALER'
    ) {
      getProducts();
    }
  }, [state.profile?.user_role]);

  /* ----------Actions ------------- */

  const getLoggedInUserProfileData = async (userId: string) => {
    const { error, data } = await supabase
      .from('profiles')
      .select('*, wards(*)')
      .eq('user_id', userId);

    if (error) {
      setErrorMessage('getLoggedInUserProfileData' + error.message);
      return;
    }

    const profileData = data as ProfileData[];
    return profileData;
  };

  function updateState<T>(key: keyof StateType, data: T | null) {
    setState((prevState) => ({
      ...prevState,
      [key]: data,
    }));
  }
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
          setErrorMessage('signUpWithEmail' + signInError.message);
        }
      } else {
        setErrorMessage('signUpWithEmail' + error.message);
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
      setErrorMessage('getWards' + error.message);
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
      setErrorMessage('getOnlyWards' + error.message);
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
      setErrorMessage('getTotalCustomers' + error.message);
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
      setErrorMessage('getCustomers' + error.message);
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
      setErrorMessage('getProducts' + error.message);
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
      setErrorMessage('getCustomerDetails' + error.message);
    } else {
      return data[0] as Customer;
    }
  };

  const uploadFile = async (
    filePath: string,
    base64: string,
    contentType: string,
    bucketName?: string
  ) => {
    let pathName = '';
    let errorMsg = '';
    try {
      const { data, error } = await supabase.storage
        .from(bucketName || BUCKET_NAME)
        .upload(filePath, decode(base64), { contentType, upsert: true });

      if (error) {
        errorMsg = error.message;
      }
      pathName = data?.path || '';
    } catch (err: any) {
      errorMsg += err.message;
    }
    console.log('uploadFile error ->', errorMsg);
    return {
      pathName,
      errorMsg,
    };
  };

  const downloadFile = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 60, {
        download: true,
      });

    if (error) {
      setErrorMessage('downloadFile' + error.message);
    } else {
      return data.signedUrl;
    }
  };

  const getPublicUrl = async (
    filePath: string,
    bucketName: string = PUBLIC_BUCKET_NAME
  ) => {
    try {
      const { data } = await supabase.storage
        .from(bucketName || BUCKET_NAME)
        .getPublicUrl(filePath);

      console.log(data);
      return data.publicUrl;
    } catch (error: any) {
      setErrorMessage('getPublicUrl' + error.message);
      return '';
    }
  };

  const storeFileInBucketAndReturnPublicUrl = async ({
    fileURI,
    filePath,
    contentType,
    folderName,
    keyName,
    bucketName,
    isPublic,
  }: StoreFileInBucketParamType) => {
    const base64 = await FileSystem.readAsStringAsync(fileURI, {
      encoding: 'base64',
    });

    const { pathName, errorMsg } = await uploadFile(
      `${folderName}/${filePath}`,
      base64,
      contentType,
      bucketName
    );

    let publicUrl = '';

    if (isPublic && pathName) {
      publicUrl = await getPublicUrl(pathName, bucketName);
    }

    return {
      keyName,
      pathName: publicUrl || pathName,
      errorMsg,
    };
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
      setErrorMessage('signUpWithPhoneAndPassword' + error.message);
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
      setErrorMessage('verifyOtp' + error.message);
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });

      if (error) {
        setErrorMessage('loginWithPhoneAndPassword' + error.message);
        return {
          success: false,
        };
      }
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      setErrorMessage('loginWithPhoneAndPassword' + error.message);
      return {
        success: false,
      };
    }
  };

  const updateUserPassword = async ({ phone, password }: PhoneAuthParams) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        phone,
        password,
      });

      if (error) {
        setErrorMessage('updateUserPassword' + error.message);
        return {
          success: false,
        };
      }
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      setErrorMessage('updateUserPassword' + error.message);
      return {
        success: false,
      };
    }
  };

  const createProfile = async (payload: ProfileDBPayload) => {
    try {
      const { error } = await supabase.from('profiles').insert(payload);

      if (error) {
        setErrorMessage('createProfile' + error.message);
        return {
          success: false,
        };
      } else {
        return {
          success: true,
        };
      }
    } catch (err: any) {
      setErrorMessage('createProfile' + err.message);
      return {
        success: false,
      };
    }
  };

  const actions = {
    getLoggedInUserProfileData,
    signUpWithEmail,
    signOut,
    getWards,
    getOnlyWards,
    getCustomers,
    getTotalCustomers,
    setErrorMessage,
    getCustomerDetails,
    signUpWithPhoneAndPassword,
    verifyOtp,
    loginWithPhoneAndPassword,
    updateUserPassword,
    updateState,
    storeFileInBucketAndReturnPublicUrl,
    downloadFile,
    createProfile,
    getPublicUrl,
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
