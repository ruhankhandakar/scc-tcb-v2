import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';

import WaterMarkBackground from 'components/common/WaterMarkBackground';
import CustomerDetailsWithEntry from 'components/CustomerEntry';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { useAppContext } from 'context/AppContext';
import { useBackEndContext } from 'context/BackEndContext';
import { Customer, StatusType } from 'types';
import { noDataIllustration } from 'constants/icons';
import { successLottie, tryAgainLottie } from 'constants/lottie_files';

const screenHeight = Dimensions.get('screen');

const CustomerEntry = () => {
  const router = useRouter();
  const {
    state,
    action: { handleErrorMessage, handleUpdateData },
  } = useAppContext();
  const {
    actions: { getCustomerDetails },
  } = useBackEndContext();

  const [loading, setLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<
    Customer | undefined
  >();
  const [status, setStatus] = useState<StatusType>('');

  const familyCardNo = state?.familyCard;

  const handleScannerRedirection = () => {
    // @ts-ignore
    router.push({
      pathname: 'qr-scanner',
      params: {
        key: 'familyCard',
      },
    });
  };

  useEffect(() => {
    handleScannerRedirection();
  }, []);

  const fetchCustomerDetails = async (familyCardNo: string) => {
    const splittedData = familyCardNo.split('_');
    if (splittedData[0] !== 'scc') {
      handleErrorMessage('এই ফ্যামিলি কার্ডটি বৈধ নয়');
      return;
    }
    const wardNum = +splittedData[1];
    const cardNum = +splittedData[2];

    if (!wardNum || !cardNum) {
      handleErrorMessage('এই ফ্যামিলি কার্ডটি বৈধ নয়');
      return;
    }

    // TODO: Check ward number for dealer, if it is not same then show error

    setLoading(true);
    const response = await getCustomerDetails(cardNum);
    setCustomerDetails(response);
    setLoading(false);
  };

  const handleClearState = (statusType: StatusType) => {
    setCustomerDetails(undefined);
    setLoading(false);
    handleUpdateData({
      familyCard: '',
    });
    setStatus(statusType);
    setTimeout(() => {
      setStatus('IDLE');
    }, 2000);
  };

  const getEl = () => {
    if (status === 'CANCEL' || status === 'SUCCESS') {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LottieView
            source={status === 'CANCEL' ? tryAgainLottie : successLottie}
            autoPlay
            loop
            style={{
              height: 200,
              width: 200,
            }}
          />
          {status === 'SUCCESS' && (
            <Text style={styles.reScanText}>এন্ট্রি সফল হয়েছে</Text>
          )}
          <Text
            style={[
              styles.reScanText,
              {
                fontSize: SIZES.medium,
              },
            ]}
          >
            আবার স্ক্যান করুন
          </Text>
          <Button
            onPress={() => handleScannerRedirection()}
            style={styles.reScanBtn}
            mode="contained"
          >
            <Ionicons name="qr-code-outline" size={24} color={COLORS.white} />
          </Button>
        </View>
      );
    }

    if (status === 'IDLE') {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={[styles.reScanText]}>নতুন স্ক্যান করুন</Text>
          <Button
            onPress={() => handleScannerRedirection()}
            style={styles.reScanBtn}
            mode="contained"
          >
            <Ionicons name="qr-code-outline" size={24} color={COLORS.white} />
          </Button>
        </View>
      );
    }

    return (
      <>
        {loading ? (
          <View>
            <ActivityIndicator
              animating={true}
              color={COLORS.primary}
              size="large"
            />
            <Text style={styles.loadingText}>কার্ড চেক করা হচ্ছে...</Text>
          </View>
        ) : (
          <>
            {customerDetails ? (
              <CustomerDetailsWithEntry
                customerDetails={customerDetails!}
                handleClearState={handleClearState}
              />
            ) : familyCardNo ? (
              <View style={styles.noDataImgContainer}>
                <Image
                  source={noDataIllustration}
                  contentFit="cover"
                  style={styles.noDataImg}
                />
                <Text variant="bodyMedium" style={styles.noDataText}>
                  এই গ্র্যাহকের কোন ডাটা খুঁজে পাওয়া যায়নি
                </Text>
              </View>
            ) : null}
          </>
        )}
      </>
    );
  };

  useEffect(() => {
    if (familyCardNo) {
      fetchCustomerDetails(familyCardNo);
      setStatus('VIEW');
    }
  }, [familyCardNo]);

  return (
    <>
      <WaterMarkBackground>
        <View
          style={[styles.container, !customerDetails && styles.centerContainer]}
        >
          {getEl()}
        </View>
      </WaterMarkBackground>

      {status === 'VIEW' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => handleScannerRedirection()}
        >
          <Ionicons name="qr-code-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default CustomerEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: screenHeight.height - 200,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.darkBlue,
  },
  fab: {
    position: 'absolute',
    marginRight: 16,
    right: 0,
    top: 10,
    backgroundColor: COLORS.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONT.medium,
    color: COLORS.lightBlue,
    textAlign: 'center',
    fontSize: SIZES.medium,
    marginTop: SIZES.xxLarge,
  },
  noDataImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.xxLarge,
    paddingHorizontal: SIZES.medium,
  },
  noDataImg: {
    height: 300,
    width: 300,
    textAlign: 'center',
  },
  noDataText: {
    color: COLORS.error,
    fontFamily: FONT.medium,
    fontSize: SIZES.xLarge,
    textAlign: 'center',
  },
  reScanText: {
    color: COLORS.darkBlue,
    fontFamily: FONT.medium,
    fontSize: SIZES.xLarge,
    textAlign: 'center',
  },
  reScanBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
});
