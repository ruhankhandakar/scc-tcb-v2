import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DocumentPickerAsset } from 'expo-document-picker';

import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';
import { processingLottie, waitingLottie } from 'constants/lottie_files';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { useAppContext } from 'context/AppContext';
import { useAuth } from 'context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

type registrationDataType = {
  number: string;
  firstName: string;
  lastName: string;
  password: string;
  selectedWard: number | null;
  nidDocuments: DocumentPickerAsset[];
};

const OnBoarding = () => {
  const router = useRouter();
  const { state } = useAppContext();
  const { handleRefresh } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  const dealerRegistrationData =
    state.dealerRegistrationData as registrationDataType;
  // {"dealerRegistrationData": {"firstName": "রুহান", "lastName": "খন্দকার", "nidDocuments": [[Object], [Object]], "number": "1728007477", "password": "123456", "selectedWard": 1}, "isShowRegistrationForm": false, "profilePicture": "file:///data/user/0/host.exp.exponent/cache/ImageManipulator/7dea9f01-3f4a-418b-83f0-3b92d3f6dd19.png"}

  useEffect(() => {
    if (dealerRegistrationData) {
      // TODO: process uploading
      console.log('OnBoarding state', dealerRegistrationData.nidDocuments);
    }
  }, [dealerRegistrationData]);

  return (
    <ScrollViewWithWaterMark>
      <Spinner visible={isProcessing} overlayColor="rgba(0,0,0,0.5)">
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AnimatedLottieView
            source={processingLottie}
            autoPlay
            loop
            style={{
              height: 300,
              width: 300,
            }}
          />
          <Text style={styles.processingText}>
            আপনার অ্যাকাউন্ট বানানো হচ্ছে {'\n'}
            অনুগ্রহ করে কিচ্ছুক্ষণ অপেক্ষা করুন
          </Text>
        </View>
      </Spinner>
      {isProcessing ? (
        <View />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AnimatedLottieView
            source={waitingLottie}
            autoPlay
            loop
            style={{
              height: 250,
              width: 250,
            }}
          />
          <Text style={styles.text}>আপনার verification এখনো pending আছে</Text>
          <Button
            mode="contained"
            buttonColor={COLORS.primary}
            style={styles.btn}
            onPress={() => {
              handleRefresh();
            }}
          >
            Refresh
          </Button>
        </View>
      )}
    </ScrollViewWithWaterMark>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    marginTop: SIZES.xLarge,
    color: COLORS.darkBlue,
    textAlign: 'center',
  },
  btn: {
    marginTop: SIZES.xLarge,
  },
  processingText: {
    color: '#fff',
    fontSize: SIZES.large,
    marginTop: SIZES.xLarge,
    textAlign: 'center',
    paddingLeft: SIZES.small,
    paddingRight: SIZES.small,
  },
});
