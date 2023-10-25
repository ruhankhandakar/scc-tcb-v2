import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { Snackbar } from 'react-native-paper';
import { Session, User, UserAttributes } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

import { supabase } from 'lib/supabase';
import { ProfileData, SelectedProfileData } from 'types/profile';
import {
  Customer,
  DealerConfig,
  IWards,
  Products,
  ScannedData,
  TWards,
} from 'types';
import {
  CustomerType,
  GetTotalCustomerParams,
  OtherConfigsData,
  OtherConfigsState,
  ProfileDBPayload,
  ScannedDataParam,
  StoreFileInBucketParamType,
  UpdateParams,
} from 'utils/types';
import { BUCKET_NAME, PUBLIC_BUCKET_NAME } from 'constants/supabase';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text, View } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { logoutLottie } from 'constants/lottie_files';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { getCurrentMonthStartAndEndDate } from 'utils';

type CustomerParams = {
  startOffset?: number;
  endOffset?: number;
  searchTerm?: string;
  column?: string;
  customerType: CustomerType;
  dealerId?: number;
  wardNum?: number;
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
  refetch: string;
  user: User | null;
  profile: ProfileData | null;
  products: Products[] | null;
  selectedProfile: SelectedProfileData | null;
  loggedInProfileData: SelectedProfileData | null;
  otherConfigs: OtherConfigsState;
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
    getTotalCustomersV2: ({
      customerType,
      wardNum,
    }: GetTotalCustomerParams) => Promise<number>;
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
    getDealerConfig: (dealerId: number) => Promise<DealerConfig[]>;
    updateProfile: (
      userId: string,
      profileData: Partial<UpdateParams>
    ) => Promise<{
      success: boolean;
    }>;
    updateUser: (params: UserAttributes) => Promise<{
      success: boolean;
    }>;
    getScannedDataTableCountOfACustomer: (
      customerId: number
    ) => Promise<number>;
    storeScannedData: (payload: ScannedDataParam) => Promise<{
      success: boolean;
    }>;
    updateDealerConfig: (
      dealerId: number,
      params: any
    ) => Promise<{
      success: boolean;
    }>;
  };
};

const initialState: StateType = {
  loading: false,
  refetch: '',
  user: null,
  profile: null,
  products: null,
  selectedProfile: null,
  loggedInProfileData: null,
  otherConfigs: {
    maxNumScannedAllowedMonth: 1,
  },
};

export const BackEndContext = createContext<ContextType | null>(null);

const BackEndContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(() => ({ ...initialState }));
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (
      state.profile?.user_role === 'ADMIN' ||
      state.profile?.user_role === 'DEALER'
    ) {
      getProducts();
      getOtherConfigs();
    }
  }, [state.profile?.user_role]);

  useEffect(() => {
    if (state.user && state.profile) {
      setState((prevState) => {
        const selectedProfileData = {
          ...prevState.profile,
          email: state.user?.email,
          phone_number: state.user?.phone!,
        } as SelectedProfileData;

        return {
          ...prevState,
          selectedProfile: selectedProfileData,
          loggedInProfileData: selectedProfileData,
        };
      });
    }
  }, [state.user, state.profile]);

  /* ----------Actions ------------- */

  const getOtherConfigs = async () => {
    let { data } = await supabase
      .from('other_configs')
      .select('config_name, config_value');

    const result = (data || []) as OtherConfigsData[];

    let maxNumScannedAllowedMonth = 1;

    result.forEach((config) => {
      if (config.config_name === 'max_num_scanned_allowed_month') {
        maxNumScannedAllowedMonth = +config.config_value;
      }
    });

    setState((prevState) => ({
      ...prevState,
      otherConfigs: {
        maxNumScannedAllowedMonth,
      },
    }));
  };

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
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setState(initialState);
    setIsLoggingOut(false);
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
    const wardNum = state.profile?.ward;

    let query = supabase
      .from('customers')
      .select('id', { count: 'exact', head: true });

    if (userRole !== 'ADMIN') {
      query = query.eq('ward', wardNum);
    }
    const { count, error } = await query;

    if (error) {
      setErrorMessage('getTotalCustomers' + error.message);
    }

    return count || 0;
  };

  const getTotalCustomersV2 = async ({
    customerType,
    wardNum,
    dealerId,
  }: GetTotalCustomerParams) => {
    const userRole = state.profile?.user_role || 'DEALER';
    const { startDate, endDate } = getCurrentMonthStartAndEndDate();

    /* 
      1. If user is dealer then filter by wardNum, otherwise not
      2. If customerType is privileged then first get data from scanned_data
    */

    let query: PostgrestFilterBuilder<
      any,
      any,
      {
        id: any;
      }[],
      unknown
    >;

    let result = 0;
    try {
      if (customerType === 'privileged') {
        query = supabase
          .from('scanned_data')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', endDate)
          .gt('created_at', startDate);

        if (userRole !== 'ADMIN') {
          query = query.eq('dealer_id', dealerId);
        }
      } else {
        query = supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });
        if (userRole !== 'ADMIN') {
          query = query.eq('ward', wardNum);
        }
      }

      const { count } = await query;
      result = count || 0;
    } catch (error) {}

    return result;
  };

  const getCustomers = async ({
    startOffset,
    endOffset,
    column,
    searchTerm,
    customerType,
    wardNum,
    dealerId,
  }: CustomerParams) => {
    const userRole = state.profile?.user_role || 'DEALER';
    const { startDate, endDate } = getCurrentMonthStartAndEndDate();

    let query: PostgrestFilterBuilder<any, any, ScannedData[], unknown>;

    if (customerType === 'privileged') {
      query = supabase
        .from('scanned_data')
        .select('*, customers(*, wards(*))')
        .lt('created_at', endDate)
        .gt('created_at', startDate)
        .order('id', {
          ascending: true,
        });
      if (userRole !== 'ADMIN') {
        query = query.eq('dealer_id', dealerId);
      }
    } else {
      query = supabase.from('customers').select('*, wards (*)').order('id', {
        ascending: true,
      });

      if (userRole !== 'ADMIN') {
        query = query.eq('ward', wardNum);
      }
    }

    if (endOffset) {
      query = query.range(startOffset!, endOffset);
    }

    if (searchTerm?.trim() && column) {
      query = query.ilike('customer_search', `%${searchTerm}%`);
    }

    const { error, data } = await query;

    let customersData: Customer[] = [];

    if (error) {
      setErrorMessage('Something went wrong ' + error.message);
    } else {
      customersData = data.map((item) => {
        if (item.customers) {
          const {
            customers: customerDataCopy,
            id,
            created_at: scanned_date,
            ...otherItems
          } = item;
          return {
            ...otherItems,
            scanned_date,
            ...customerDataCopy,
          };
        }
        return item;
      }) as Customer[];
    }
    return customersData;
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

  const getDealerConfig = async (dealerId: number) => {
    try {
      let query = supabase.from('dealer_config').select('*');

      query = query.eq('dealer_id', dealerId);

      const { error, data } = await query;

      let result: DealerConfig[] = [];

      if (error) {
        setErrorMessage('getDealerConfig' + error.message);
      } else {
        result = data;
      }
      return result;
    } catch (error) {
      return [];
    }
  };

  const updateDealerConfig = async (dealerId: number, params: any) => {
    try {
      const { data, error } = await supabase
        .from('dealer_config')
        .update(params)
        .eq('dealer_id', dealerId);

      if (error) {
        setErrorMessage('updateDealerConfig' + error.message);
        return {
          success: false,
        };
      } else {
        return {
          success: true,
        };
      }
    } catch (err: any) {
      setErrorMessage('updateDealerConfig' + err.message);
      return {
        success: true,
      };
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
      if (error.status === 400) {
        setErrorMessage(
          'এই নাম্বার রেজিস্টার করা আছে । অনুগ্রহ করে লগইন করুন।'
        );
      } else {
        setErrorMessage('signUpWithPhoneAndPassword' + error.message);
      }
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
        setErrorMessage(
          'অনুগ্রহ করে valid নাম্বার এবং পাসওয়ার্ড ব্যবহার করুন'
        );
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

  const updateProfile = async (
    userId: string,
    profileData: Partial<UpdateParams>
  ) => {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId);

    if (error) {
      setErrorMessage(error.message);
      return {
        success: false,
      };
    } else {
      return {
        success: true,
      };
    }
  };

  const updateUser = async (params: UserAttributes) => {
    try {
      const { error } = await supabase.auth.updateUser(params);
      if (error) {
        setErrorMessage(error.message);
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    } catch (err: any) {
      setErrorMessage(err.message);
      return {
        success: false,
      };
    }
  };

  const getScannedDataTableCountOfACustomer = async (customerId: number) => {
    const { startDate, endDate } = getCurrentMonthStartAndEndDate();
    const { data, error } = await supabase
      .from('scanned_data')
      .select('id')
      .eq('customer_id', customerId)
      .lt('created_at', endDate)
      .gt('created_at', startDate);

    let scannedCount = 0;
    if (error) {
      setErrorMessage('getScannedDataTableCountOfACustomer ->' + error.message);
    } else {
      scannedCount = data.length;
    }

    return scannedCount;
  };

  const storeScannedData = async (payload: ScannedDataParam) => {
    const { data, error } = await supabase.from('scanned_data').insert(payload);

    if (error) {
      setErrorMessage(error.message);
      return {
        success: false,
      };
    } else {
      return {
        success: true,
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
    getDealerConfig,
    updateProfile,
    updateUser,
    getScannedDataTableCountOfACustomer,
    storeScannedData,
    updateDealerConfig,
    getTotalCustomersV2,
  };

  return (
    <BackEndContext.Provider value={{ state, actions }}>
      <Spinner visible={isLoggingOut} overlayColor="rgba(0,0,0,0.5)">
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AnimatedLottieView
            source={logoutLottie}
            autoPlay
            loop
            style={{
              height: 300,
              width: 300,
            }}
          />
          <Text
            style={{
              fontFamily: FONT.bold,
              fontSize: SIZES.medium,
              marginTop: SIZES.xLarge,
              color: COLORS.error,
              textAlign: 'center',
              backgroundColor: COLORS.white,
              padding: SIZES.medium,
              width: '100%',
            }}
          >
            Logging out...
          </Text>
        </View>
      </Spinner>
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
