import { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

import { SIZES } from 'constants/theme';

const CustomerEntry = () => {
  const theme = useTheme();

  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [showScannedUserDetails, setShowScannedUserDetails] = useState(false);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
        {showScannedUserDetails ? (
          <View>
            <Text>User Details</Text>
          </View>
        ) : (
          <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
              <View style={styles.flexCenter}>
                <Button
                  icon="camera"
                  mode="contained"
                  style={{
                    padding: SIZES.xSmall,
                    width: 300,
                  }}
                  onPressIn={() => setScanned(false)}
                >
                  Tap to Scan Again
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomerEntry;

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
