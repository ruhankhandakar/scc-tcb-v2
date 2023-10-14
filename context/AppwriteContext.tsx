import { useRootNavigation, useRouter, useSegments } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Models, Query } from 'appwrite';

import { appwrite } from 'lib/appwrite-service';
import { useAuth } from './AuthContext';

// TODO: get from env
const DATABASE_CONFIG = {
  databaseName: '6527640377459bff03c3',
  collectionName: {
    userDetails: '652aa11a530fca39840a',
    customers: '65298994bb1dce1cc719',
    wards: '652988b8be99fa37dde1',
    users: '65276532b9690e4ffdd6',
  },
};

interface AppwriteContextValue {
  fetching: boolean;
  userDetails: Models.Document | null;
}

interface ProviderProps {
  children: React.ReactNode;
}

const AppwriteContext = React.createContext<AppwriteContextValue | undefined>(
  undefined
);

export function AppwriteProvider(props: ProviderProps) {
  const [fetching, setFetching] = useState(false);
  const [userDetails, setUserDetails] = useState<Models.Document | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getDataFromDatabase(
        DATABASE_CONFIG.databaseName,
        DATABASE_CONFIG.collectionName.userDetails,
        [Query.equal('phoneNumber', user?.phone!)]
      ).then((response) => {
        if (response?.documents.length) {
          setUserDetails(response?.documents[0]);
        }
      });
    }
  }, [user]);

  const getDataFromDatabase = async (
    databaseName: string,
    collectionName: string,
    filter: any
  ) => {
    try {
      setFetching(true);
      const response = await appwrite.databases.listDocuments(
        databaseName,
        collectionName,
        filter
      );
      return response;
    } catch (error) {
      console.log('getDataFromDatabase error', error);
    } finally {
      setFetching(false);
    }
  };

  const getFile = async () => {
    try {
      setFetching(true);
      const response = appwrite.storage.getFileDownload(
        '652aa2efed70942cb1d1',
        '652aab4d22dd895eae8f'
      );
      console.log('response', response);
    } catch (error) {
      console.log('getFile error', error);
    } finally {
      setFetching(false);
    }
  };

  return (
    <AppwriteContext.Provider
      value={{
        fetching,
        userDetails,
      }}
    >
      {props.children}
    </AppwriteContext.Provider>
  );
}

export const useAppwrite = () => {
  const appwriteContext = useContext(AppwriteContext);

  if (!appwriteContext) {
    throw new Error(
      'appwriteContext must be used within an AppwriteContextProvider'
    );
  }

  return appwriteContext;
};
