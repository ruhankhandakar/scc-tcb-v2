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
import { CardAndDealerCheck, Customer, StatusType } from 'types';
import { noDataIllustration } from 'constants/icons';
import {
  oopsLottie,
  submittingLottie,
  successLottie,
  tryAgainLottie,
} from 'constants/lottie_files';
import { CustomerEntrySubmitParams, ScannedDataParam } from 'utils/types';
import Spinner from 'react-native-loading-spinner-overlay';
import AnimatedLottieView from 'lottie-react-native';
import { ProfileData } from 'types/profile';
import { convertNumberToBangla } from 'utils';

const screenHeight = Dimensions.get('screen');

const CustomerEntry = () => {
  const router = useRouter();
  const {
    state,
    action: { handleUpdateData },
  } = useAppContext();
  const {
    state: { profile, user, otherConfigs, wardsList },
    actions: {
      getCustomerDetails,
      getDealerConfig,
      getScannedDataTableCountOfACustomer,
      storeScannedData,
      updateDealerConfig,
    },
  } = useBackEndContext();

  const [loading, setLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<
    Customer | undefined
  >();
  const [status, setStatus] = useState<StatusType>('');
  const [infoErrorMessage, setInfoErrorMessage] = useState('');
  const [_dealerId, setDealerId] = useState<number | null>(null);
  const [priviledgedCustomerNumber, setPriviledgedCustomerNumber] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_dealerDetails, setDealerDetails] = useState<ProfileData[] | null>(
    null
  );

  const familyCardNo = state?.familyCard;

  const handleScannerRedirection = () => {
    // @ts-ignore
    router.push({
      pathname: '/(public)/qr-scanner',
      params: {
        key: 'familyCard',
      },
    });
  };

  useEffect(() => {
    if (!familyCardNo) {
      handleScannerRedirection();
    }
  }, [familyCardNo]);

  const getDealerIdFromWardNumber = (wardNum: number) => {
    let dealerDetails: ProfileData[] = [];

    const wardData = wardsList.find((ward) => ward.id === wardNum);

    if (wardData) {
      dealerDetails = wardData.profiles.filter(
        (profile) => profile.is_verified
      );
    }
    return dealerDetails;
  };

  const cardAndDealerCheck = async ({
    dealerId,
    customerId,
    wardNumber,
  }: CardAndDealerCheck) => {
    const result = await getDealerConfig(dealerId);

    if (!result.length) {
      setInfoErrorMessage('এই ডিলার বৈধ নয়');
      return;
    }

    const { registered_customer, privileged_customer } = result[0];
    const { maxNumScannedAllowedMonth } = otherConfigs;

    // * If privileged_customer  >= registered_customer * maxNumScannedAllowedMonth -> true, then show error, otherwise continue
    if (
      privileged_customer >=
      registered_customer * maxNumScannedAllowedMonth
    ) {
      setInfoErrorMessage('আপনি এই মাসের সমস্ত কোটা শেষ করেছেন');
      return;
    }

    //! ------------------- Now Customer details check -----------------------
    // * If scanned number of the customer of the current month >= maxNumScannedAllowedMonth -> true, then show error, otherwise continue
    const numOfScannedOfThisMonth = await getScannedDataTableCountOfACustomer(
      customerId,
      dealerId
    );
    if (numOfScannedOfThisMonth >= maxNumScannedAllowedMonth) {
      setInfoErrorMessage(
        'এই ফ্যামিলি কার্ডটি ইতিমধ্যে এই মাসে 2 বার ব্যবহার করা হয়েছে।'
      );
      return;
    }

    setPriviledgedCustomerNumber(privileged_customer);
    return true;
  };

  const fetchCustomerDetails = async (familyCardNo: string) => {
    setLoading(true);
    const splittedData = familyCardNo.split('_');
    if (splittedData[0] !== 'scc') {
      setInfoErrorMessage('এই ফ্যামিলি কার্ডটি বৈধ নয়');
      setLoading(false);
      return;
    }
    const wardNum = +splittedData[1];
    const cardNum = +splittedData[2];

    if (!wardNum || !cardNum) {
      setInfoErrorMessage('এই ফ্যামিলি কার্ডটি বৈধ নয়');
      setLoading(false);
      return;
    }

    const loggedInUserRole = profile?.user_role || 'DEALER';

    //* 1st check whether user is admin or dealer
    if (loggedInUserRole === 'ADMIN') {
      // * get dealer id from ward number
      const dealerDetails = getDealerIdFromWardNumber(wardNum);

      // * If dealer details not found -> then show error message, otherwise continue
      if (!dealerDetails?.length) {
        setInfoErrorMessage(
          `ওয়ার্ড ${convertNumberToBangla(
            wardNum
          )} এর জন্য কোন Dealer খুঁজে পাওয়া যায়নি।`
        );
        setLoading(false);
        return;
      }

      setDealerDetails(dealerDetails);
    }
    if (loggedInUserRole === 'DEALER') {
      //* Now check ward matching
      if (wardNum !== profile?.ward) {
        setInfoErrorMessage(`এই পরিবার কার্ড এর অ্যাক্সেস আপনার কাছে নেই।`);
        setLoading(false);
      } else {
        setDealerId(profile.id);
        // * Now check more condition
        await cardAndDealerCheck({
          customerId: cardNum,
          dealerId: profile.id,
          wardNumber: wardNum,
        });
      }
    }
    // TODO: Check whether it is calling if any condition matched for Dealer
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

  const handleSubmit = async ({
    productLists,
    customerId,
    selectedDealerId,
  }: CustomerEntrySubmitParams) => {
    setIsSubmitting(true);

    if (selectedDealerId) {
      // * That's mean Admin is doing scanning
      /* 
        1. First check cardAndDealerCheck
        2. If all goes well then process next step
      */
      const response = await cardAndDealerCheck({
        dealerId: selectedDealerId,
        customerId,
      });
      if (response == undefined) {
        setIsSubmitting(false);
        return false;
      }
    }

    const dealer_id = selectedDealerId || _dealerId!;
    // * Update process starting from submit button -----
    /* 
      1. create one entry in scanned_data table
      2. Increase privileged_customer by 1
      3. call handleRefresh and router.replace('/') -> Do after 2 sec of success animation
    */
    const scannedDataPayload: ScannedDataParam = {
      user_id: user!.id,
      customer_id: customerId,
      dealer_id,
      other_data: {
        product_lists: productLists,
      },
    };

    const response = await storeScannedData(scannedDataPayload);

    if (response.success) {
      // * Do Step 2
      const result = await updateDealerConfig(dealer_id, {
        privileged_customer: priviledgedCustomerNumber + 1,
      });
      if (result.success) {
        setStatus('SUCCESS');
        setTimeout(() => {
          router.replace('/');
          setCustomerDetails(undefined);
          handleUpdateData({
            familyCard: '',
          });
          setStatus('IDLE');
        }, 3000);
      }
    }

    setIsSubmitting(false);
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
          {status === 'CANCEL' && (
            <>
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
                <Ionicons
                  name="qr-code-outline"
                  size={24}
                  color={COLORS.white}
                />
              </Button>
            </>
          )}
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
                handleSubmit={handleSubmit}
                dealerDetails={_dealerDetails}
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
        <Spinner visible={isSubmitting} overlayColor="rgba(0,0,0,0.5)">
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <AnimatedLottieView
              source={submittingLottie}
              autoPlay
              loop
              style={{
                height: 300,
                width: 300,
              }}
            />
          </View>
        </Spinner>
        <View
          style={[styles.container, !customerDetails && styles.centerContainer]}
        >
          {infoErrorMessage ? (
            <View style={styles.infoErrorContainer}>
              <LottieView
                source={oopsLottie}
                autoPlay
                loop
                style={{
                  height: 150,
                  width: 150,
                }}
              />
              <Text style={styles.infoErrorText}>{infoErrorMessage}</Text>
            </View>
          ) : (
            getEl()
          )}
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
    padding: SIZES.medium,
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
  infoErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  infoErrorText: {
    color: COLORS.error,
    fontFamily: FONT.medium,
    fontSize: SIZES.large,
    textAlign: 'center',
    padding: SIZES.medium,
  },
});
