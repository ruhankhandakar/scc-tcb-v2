import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

const initialState = {
  state: {
    isShowRegistrationForm: false,
  },
  action: {
    handleUpdateData: (params?: any) => undefined,
  },
};

type ContextType = typeof initialState & {
  state: {
    isShowRegistrationForm: boolean;
    [key: string]: any;
  };
  action: {
    handleErrorMessage: (message: string) => void;
  };
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(initialState.state);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateData = (params: Pick<ContextType, 'state'>): undefined => {
    setData((prevData) => ({
      ...prevData,
      ...params,
    }));
  };

  const handleErrorMessage = (message: string): void => {
    setErrorMessage(message);
  };

  return (
    <AppContext.Provider
      value={{ state: data, action: { handleUpdateData, handleErrorMessage } }}
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
