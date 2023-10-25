import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

import { FileUploadDocumentKeyName } from 'types';
import { RegisterFormData } from 'utils/types';

const initialState = {
  state: {
    isShowRegistrationForm: false,
    FileUploadConfig: null,
  },
  action: {
    handleUpdateData: (params?: any) => undefined,
  },
};

type ContextType = typeof initialState & {
  state: {
    isShowRegistrationForm: boolean;
    FileUploadConfig: FileUploadConfig | null;
    registeredFormData: RegisterFormData;
    fileUploadConfig: FileUploadConfig | null;
  };
  action: {
    handleErrorMessage: (message: string) => void;
    setFileUploadConfig: (filConfig: FileUploadConfig | null) => void;
    onRegisteredFormDataChange: (
      key: keyof RegisterFormData,
      value: RegisterFormData[typeof key]
    ) => void;
  };
};

type FileUploadConfig = {
  multiple?: boolean;
  type?: string[];
  maxFileSize?: number;
  maxFileSizeAllowed?: number;
  pathName?: string;
  keyName?: string;
  documentKeyName: FileUploadDocumentKeyName;
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(initialState.state);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileUploadConfig, _setFileUploadConfig] =
    useState<FileUploadConfig | null>(null);
  const [registeredFormData, setRegisteredFormData] =
    useState<RegisterFormData>({
      number: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      selectedWard: null,
      nidDocuments: [],
      deoDocuments: [],
      profilePicture: null,
    });

  const handleUpdateData = (params: Pick<ContextType, 'state'>): undefined => {
    setData((prevData) => ({
      ...prevData,
      ...params,
    }));
  };

  const onRegisteredFormDataChange = (
    key: keyof RegisterFormData,
    value: RegisterFormData[typeof key]
  ) => {
    setRegisteredFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleErrorMessage = (message: string): void => {
    setErrorMessage(message);
  };

  const setFileUploadConfig = (filConfig: FileUploadConfig | null) => {
    _setFileUploadConfig(filConfig);
  };

  return (
    <AppContext.Provider
      value={{
        state: { ...data, fileUploadConfig, registeredFormData },
        action: {
          handleUpdateData,
          handleErrorMessage,
          setFileUploadConfig,
          onRegisteredFormDataChange,
        },
      }}
    >
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
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext) as ContextType;

export default AppContextProvider;
