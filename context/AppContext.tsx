import { ReactNode, createContext, useContext, useState } from 'react';

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
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(initialState.state);

  const handleUpdateData = (params: Pick<ContextType, 'state'>): undefined => {
    setData((prevData) => ({
      ...prevData,
      ...params,
    }));
  };
  return (
    <AppContext.Provider value={{ state: data, action: { handleUpdateData } }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext) as ContextType;

export default AppContextProvider;
