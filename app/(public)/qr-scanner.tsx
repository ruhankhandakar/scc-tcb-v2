import { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { Stack, router, useGlobalSearchParams } from 'expo-router';
import { XMLParser } from 'fast-xml-parser';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';

import { COLORS, SIZES } from 'constants/theme';
import { useAppContext } from 'context/AppContext';

const parser = new XMLParser();

const Scanner = () => {
  const { key = 'barCodeData' } = useGlobalSearchParams();
  const {
    action: { handleUpdateData },
  } = useAppContext();

  const theme = useTheme();
  const keyName = key as string;

  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    try {
      const scannedData = parser.parse(data);
      handleUpdateData({
        [keyName]: _.isEmpty(scannedData) ? data : scannedData,
      });
    } catch (error) {
      handleUpdateData({
        [keyName]: data,
      });
    } finally {
      router.back();
    }
  };

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    getBarCodeScannerPermissions();
  }, []);

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.areaViewContainer}>
        <View style={{ ...styles.flexCenter, marginTop: SIZES.medium }}>
          <Text
            variant="headlineLarge"
            style={{
              color: theme.colors.error,
              fontSize: SIZES.large - 2,
              textAlign: 'center',
              marginBottom: SIZES.small,
            }}
          >
            Requesting for camera permission
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.areaViewContainer}>
        <View style={styles.flexCenter}>
          <Text
            variant="headlineLarge"
            style={{
              color: theme.colors.error,
              fontSize: SIZES.large - 2,
              textAlign: 'center',
              marginBottom: SIZES.small,
            }}
          >
            No Access To Camera
          </Text>
          <Button
            onPressIn={getBarCodeScannerPermissions}
            icon="camera"
            mode="contained"
            style={{
              padding: SIZES.xSmall,
              width: 300,
            }}
          >
            Give Permission
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.areaViewContainer}>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </SafeAreaView>
  );
};

const RootScanner = () => {
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
      <Scanner />
    </SafeAreaView>
  );
};

export default RootScanner;

const styles = StyleSheet.create({
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaViewContainer: {
    flex: 1,
    paddingBottom: SIZES.xxLarge,
    paddingTop: SIZES.xxLarge,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
