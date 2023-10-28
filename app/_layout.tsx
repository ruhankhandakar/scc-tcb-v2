import { Slot } from 'expo-router';
import ErrorBoundary from 'react-native-error-boundary';
import { View, Text, Button } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MenuProvider } from 'react-native-popup-menu';

import { AuthProvider } from 'context/AuthContext';
import AppContextProvider from 'context/AppContext';
import BackEndContextProvider from 'context/BackEndContext';

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

export default function Root() {
  const [fontLoaded] = useFonts({
    DMBold: require('assets/fonts/DMSans-Bold.ttf'),
    DMMedium: require('assets/fonts/DMSans-Medium.ttf'),
    DMRegular: require('assets/fonts/DMSans-Regular.ttf'),
  });

  useEffect(() => {
    if (fontLoaded) {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 2000);
    }
  }, [fontLoaded]);

  if (!fontLoaded) return null;

  // Set up the auth context and render our layout inside of it.
  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <AuthProvider>
        <AppContextProvider>
          <BackEndContextProvider>
            <BottomSheetModalProvider>
              <MenuProvider>
                <Slot />
              </MenuProvider>
            </BottomSheetModalProvider>
          </BackEndContextProvider>
        </AppContextProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
