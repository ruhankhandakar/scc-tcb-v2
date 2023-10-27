import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { Image } from 'expo-image';
import 'dayjs/locale/bn-bd';
import dayjs from 'dayjs';
import { AntDesign } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as WebBrowser from 'expo-web-browser';

import { COLORS, SIZES, SHADOWS, FONT } from 'constants/theme';
import { useRef, useState } from 'react';
import { Button } from 'react-native-paper';
import { ProfileData } from 'types/profile';
import { useBackEndContext } from 'context/BackEndContext';
import Spinner from 'react-native-loading-spinner-overlay';
import AnimatedLottieView from 'lottie-react-native';
import { submittingLottie } from 'constants/lottie_files';

interface Props {
  profileData: ProfileData;
  filterPendingDealerListData: (id: number) => void;
}

const Card = ({ profileData, filterPendingDealerListData }: Props) => {
  const {
    actions: { activateDealer, downloadFile },
  } = useBackEndContext();

  const {
    profile_picture,
    created_at,
    wards,
    foundation_name,
    deo_documents,
    document_proof_link,
    id: dealerId,
    first_name,
    last_name,
  } = profileData;

  const [bottomSheetViewType, setBottomSheetViewType] = useState<
    'accept' | 'reject'
  >('accept');
  const [registeredCustomerNumber, setRegisteredCustomerNumber] = useState<
    string | undefined
  >(undefined);
  const [remarks, setRemarks] = useState<string | undefined>(undefined);
  const [infoMSg, setInfoMSg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleAccept = () => {
    bottomSheetModalRef?.current?.present();
    setBottomSheetViewType('accept');
  };
  const handleReject = () => {
    bottomSheetModalRef?.current?.present();
    setBottomSheetViewType('reject');
  };

  const handleAcceptSubmit = async () => {
    if (
      !registeredCustomerNumber ||
      isNaN(parseFloat(registeredCustomerNumber))
    ) {
      setInfoMSg('নাম্বার ভ্যালিড নয়');
      return;
    }
    setSubmitting(true);
    const response = await activateDealer({
      actionType: 'accept',
      dealerId,
      registered_customer: +registeredCustomerNumber,
    });

    if (response.success) {
      filterPendingDealerListData(dealerId);
    }

    setSubmitting(false);
  };

  const handleRejectSubmit = async () => {
    setSubmitting(true);
    const response = await activateDealer({
      actionType: 'reject',
      dealerId,
      remarks,
    });

    if (response.success) {
      filterPendingDealerListData(dealerId);
    }

    setSubmitting(false);
  };

  const handleDownloadFile = async (filePath: string) => {
    try {
      const response = await downloadFile(filePath);
      if (response) {
        await WebBrowser.openBrowserAsync(response);
      }
    } catch (error) {}
  };

  return (
    <>
      <View style={styles.container}>
        {/* Profile Pic */}
        <View style={styles.profilePicContainer}>
          <Image
            source={{
              uri: profile_picture,
            }}
            contentFit="cover"
            style={styles.profilePic}
            cachePolicy="none"
          />
        </View>

        {/* Details */}
        <Text style={styles.nameText}>
          {first_name} {last_name}
        </Text>
        <Text style={styles.joinedAtText}>
          নিবন্ধিত করেছেঃ{' '}
          {dayjs(created_at).locale('bn-bd').format('DD  MMMM YY, A h:m')}
        </Text>
        <Text style={styles.wardText}>{wards?.name!}</Text>
        <Text style={styles.foundationText}>
          ফাউন্ডেশন নামঃ <Text style={styles.bold}>{foundation_name}</Text>
        </Text>

        {/* Files Details */}
        <View style={styles.fileListContainer}>
          <View style={styles.fileList}>
            <Text style={styles.fileListText}>জাতীয় পরিচয় পত্র কার্ডঃ</Text>
            <View style={styles.fileViewContainer}>
              {document_proof_link?.map((link) => (
                <Pressable
                  key={link}
                  android_ripple={{
                    color: COLORS.primary,
                    borderless: true,
                    radius: 25,
                    foreground: true,
                  }}
                  onPress={() => {
                    handleDownloadFile(link);
                  }}
                >
                  <AntDesign name="eye" size={24} color={COLORS.primary} />
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.fileList}>
            <Text style={styles.fileListText}>DEO কার্ডঃ</Text>
            <View style={styles.fileViewContainer}>
              {deo_documents?.map((link) => (
                <Pressable
                  key={link}
                  android_ripple={{
                    color: COLORS.primary,
                    borderless: true,
                    radius: 25,
                    foreground: true,
                  }}
                  onPress={() => {
                    handleDownloadFile(link);
                  }}
                >
                  <AntDesign name="eye" size={24} color={COLORS.primary} />
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsBtnContainer}>
          <Pressable
            style={styles.btn}
            onPress={handleReject}
            android_ripple={{
              color: COLORS.gray2,
              borderless: true,
              radius: 30,
              foreground: true,
            }}
          >
            <Text style={styles.btnText}>Reject</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.acceptBtn]}
            onPress={handleAccept}
            android_ripple={{
              color: COLORS.gray2,
              borderless: true,
              radius: 30,
              foreground: true,
            }}
          >
            <Text style={[styles.btnText, styles.acceptBtnText]}>Accept</Text>
          </Pressable>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['40%']}
        backgroundStyle={{
          borderRadius: SIZES.medium,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={styles.bottomSheetContainer}>
          {bottomSheetViewType === 'accept' && (
            <View>
              <Text style={styles.acceptViewText}>
                নিবন্ধিত উপকারভোগকারির সংখ্যা দিন
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={registeredCustomerNumber}
                  placeholder="এখানে নাম্বার লিখুন"
                  placeholderTextColor={COLORS.gray}
                  onChangeText={(text: string) => {
                    setRegisteredCustomerNumber(text);
                  }}
                  keyboardType="phone-pad"
                />
              </View>
              {!!infoMSg && <Text style={styles.infoTxt}>{infoMSg}</Text>}
              <Button
                mode="contained"
                buttonColor={COLORS.primary}
                disabled={!registeredCustomerNumber}
                onPress={handleAcceptSubmit}
              >
                সাবমিট
              </Button>
            </View>
          )}
          {bottomSheetViewType === 'reject' && (
            <View>
              <Text style={styles.acceptViewText}>
                অনুগ্রহ করে প্রত্যাখ্যানের কারণ দিন
              </Text>
              <View
                style={[styles.inputContainer, styles.remarksInputContainer]}
              >
                <TextInput
                  style={styles.input}
                  value={remarks}
                  placeholder="এখানে কারণ লিখুন"
                  placeholderTextColor={COLORS.gray}
                  onChangeText={(text: string) => {
                    setRemarks(text);
                  }}
                  multiline
                  numberOfLines={4}
                />
              </View>
              {!!infoMSg && <Text style={styles.infoTxt}>{infoMSg}</Text>}
              <Button
                mode="contained"
                buttonColor={COLORS.primary}
                disabled={!remarks}
                onPress={handleRejectSubmit}
              >
                সাবমিট
              </Button>
            </View>
          )}
        </View>
      </BottomSheetModal>
      <Spinner visible={submitting} overlayColor="rgba(0,0,0,0.5)">
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
    </>
  );
};

export default Card;

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#fff',
    padding: SIZES.medium,
    borderRadius: 10,
    ...SHADOWS.medium,
  },
  actionsBtnContainer: {
    flexDirection: 'row',
    gap: SIZES.medium,
    marginTop: SIZES.small,
  },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: SIZES.xSmall - 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  btnText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    fontWeight: '700',
    color: COLORS.gray,
  },
  acceptBtnText: {
    color: COLORS.white,
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  profilePicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: SIZES.small,
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(112, 41, 239, 0.2)',
  },
  nameText: {
    textAlign: 'center',
    color: COLORS.darkBlue,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  joinedAtText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  wardText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.darkBlue,
    textAlign: 'center',
  },
  foundationText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.darkBlue,
    textAlign: 'center',
  },
  fileListContainer: {
    marginTop: SIZES.medium,
  },
  fileList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium - 4,
  },
  fileListText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium - 2,
    color: COLORS.darkBlue,
  },
  bottomSheetContainer: {
    padding: SIZES.medium,
  },
  acceptViewText: {
    textAlign: 'center',
    color: COLORS.darkBlue,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 16,
    height: 50,
    marginTop: SIZES.medium,
  },
  remarksInputContainer: {
    height: 60,
    paddingHorizontal: 10,
  },
  input: {
    color: COLORS.darkBlue,
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  infoTxt: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  fileViewContainer: {
    flexDirection: 'row',
    gap: SIZES.medium,
  },
});
