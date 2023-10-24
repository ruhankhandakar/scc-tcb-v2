import React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, router, useGlobalSearchParams } from 'expo-router';
import { CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { useAppContext } from 'context/AppContext';

import { COLORS } from 'constants/theme';
import CameraCapture from 'components/common/Camera';

const camera = () => {
  const { key = '' } = useGlobalSearchParams();
  const keyName = key as string;

  const {
    action: { handleUpdateData },
  } = useAppContext();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color="black"
                onPress={() => {
                  router.back();
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <CameraCapture
        cameraType={CameraType.back}
        keyName={keyName || 'capturedImage'}
      />
    </SafeAreaView>
  );
};

export default camera;
