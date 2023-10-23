import { useFonts } from 'expo-font';
import { Slot, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Button, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import ErrorBoundary from 'react-native-error-boundary';

import ScreenHeaderBtn from 'components/common/header/ScreenHeaderBtn';

import ThemeProvider from 'context/ThemeProvider';
import AppContextProvider from 'context/AppContext';
import BackEndContextProvider from 'context/BackEndContext';

import { logoIcon } from 'constants/icons';
import { COLORS, SIZES } from 'constants/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CustomFallback = (props: { error: Error; resetError: Function }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Something happened!</Text>
    <Text>{props.error.toString()}</Text>
    <Text>Please contact with Sylhet City Coporation - Niaz Morshed</Text>
    <Button
      onPress={() => {
        props.resetError();
      }}
      title={'Try again'}
    />
  </View>
);

const Layout = () => {
  const [fontLoaded] = useFonts({
    DMBold: require('assets/fonts/DMSans-Bold.ttf'),
    DMMedium: require('assets/fonts/DMSans-Medium.ttf'),
    DMRegular: require('assets/fonts/DMSans-Regular.ttf'),
  });

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) return null;

  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <BackEndContextProvider>
        <RootLayoutNav />
      </BackEndContextProvider>
    </ErrorBoundary>
  );
};

function RootLayoutNav() {
  const headerStyle: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: COLORS.white,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: SIZES.medium,
    },
    headerShadowVisible: false,
    headerBackVisible: false,
    title: '(TCB) সিলেট সিটি কর্পোরেশন',
    headerLeft: () => (
      <View style={{ marginRight: 5 }}>
        <ScreenHeaderBtn iconUrl={logoIcon} dimension="100%" />
      </View>
    ),
    headerRight: () => '',
  };

  return (
    <ThemeProvider>
      <AppContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={headerStyle} />
            <Stack.Screen name="(auth)" options={headerStyle} />
            <Stack.Screen name="(tabs)" options={headerStyle} />
            <Stack.Screen name="(public)" options={headerStyle} />
          </Stack>
        </GestureHandlerRootView>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default Layout;
