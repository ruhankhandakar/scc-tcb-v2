import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import ScreenHeaderBtn from 'components/common/header/ScreenHeaderBtn';
import Notification from 'components/common/Notification';

import { useAuth } from 'context/AuthContext';
import { loadingLottie } from 'constants/lottie_files';
import { COLORS, SIZES } from 'constants/theme';
import { logoIcon } from 'constants/icons';

const headerStyle: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.white,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: SIZES.medium - 2,
  },
  headerShadowVisible: false,
  headerBackVisible: false,
  title: '(TCB) সিলেট সিটি কর্পোরেশন',
  headerLeft: () => (
    <View style={{ marginRight: 5 }}>
      <ScreenHeaderBtn iconUrl={logoIcon} dimension="100%" />
    </View>
  ),
  headerRight: () => <Notification />,
};

export default function AppLayout() {
  const { authInitialized, session, handleRefresh } = useAuth();

  useEffect(() => {
    handleRefresh();
  }, []);

  if (!authInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <LottieView
          source={loadingLottie}
          autoPlay
          loop
          style={{
            height: 150,
            width: 150,
          }}
        />
      </View>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack screenOptions={headerStyle} />;
}
