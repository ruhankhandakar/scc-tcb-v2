import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS } from 'constants/theme';

const index = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
      <Redirect href="/(tabs)/home" />
    </>
  );
};

export default index;

const styles = StyleSheet.create({});
