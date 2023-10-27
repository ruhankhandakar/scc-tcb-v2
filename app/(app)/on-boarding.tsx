import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DocumentPickerAsset } from 'expo-document-picker';
import Spinner from 'react-native-loading-spinner-overlay';

import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';
import { processingLottie, waitingLottie } from 'constants/lottie_files';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { useAppContext } from 'context/AppContext';
import { useAuth } from 'context/AuthContext';
import { useBackEndContext } from 'context/BackEndContext';
import { getExtensionFromUrl } from 'utils';
import { ProfileDBPayload } from 'utils/types';
import { PUBLIC_BUCKET_NAME } from 'constants/supabase';

type registrationDataType = {
  number: string;
  firstName: string;
  lastName: string;
  password: string;
  selectedWard: number | null;
  foundationName: string;
  nidDocuments: DocumentPickerAsset[];
  deoDocuments: DocumentPickerAsset[];
  profilePicture: DocumentPickerAsset;
};

interface FulfilledResult {
  status: 'fulfilled' | 'rejected';
  value: {
    errorMsg: string;
    keyName: string;
    pathName: string;
  } | null;
}

type ExtendedDocumentPickerAsset = DocumentPickerAsset & {
  keyName: string;
  fileName: string;
  bucketName?: string;
  isPublic?: boolean;
};

const OnBoarding = () => {
  const router = useRouter();
  const {
    state,
    action: { handleUpdateData, clearState },
  } = useAppContext();
  const { handleRefresh } = useAuth();
  const {
    state: { user },
    actions: { storeFileInBucketAndReturnPublicUrl, createProfile, signOut },
  } = useBackEndContext();

  const [isProcessing, setIsProcessing] = useState(false);

  const dealerRegistrationData =
    state.dealerRegistrationData as registrationDataType;

  const uploadAllFiles = async (files: ExtendedDocumentPickerAsset[]) => {
    // @ts-ignore
    const allSettledResults: FulfilledResult[] = await Promise.allSettled(
      files.map(async (file) => {
        return await storeFileInBucketAndReturnPublicUrl({
          fileURI: file.uri,
          contentType: file.mimeType || 'image/png',
          folderName: file.keyName,
          filePath: `${user!.phone}_${file.fileName}.${getExtensionFromUrl(
            file.uri
          )}`,
          keyName: file.keyName,
          bucketName: file.bucketName,
          isPublic: file.isPublic,
        });
      })
    );

    const payload = {
      deoDocuments: [],
      nidDocuments: [],
      profilePicture: '',
    };
    allSettledResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value?.keyName === 'profilePicture') {
          payload.profilePicture = result.value.pathName;
        } else {
          // @ts-ignore
          payload[result.value.keyName].push(result.value.pathName);
        }
      }
    });

    return payload;
  };

  const processingAccountCreation = async (data: registrationDataType) => {
    setIsProcessing(true);

    let files: ExtendedDocumentPickerAsset[] = [];

    if (data.deoDocuments?.length) {
      files = [
        ...files,
        ...data.deoDocuments.map((document, index) => ({
          ...document,
          fileName: `deoDocuments${index + 1}`,
          keyName: 'deoDocuments',
        })),
      ];
    }
    if (data.nidDocuments?.length) {
      files = [
        ...files,
        ...data.nidDocuments.map((document, index) => ({
          ...document,
          fileName: `nidDocuments_${index + 1}`,
          keyName: 'nidDocuments',
        })),
      ];
    }
    if (data.profilePicture) {
      const upatedPic = {
        ...data.profilePicture,
        keyName: 'profilePicture',
        fileName: 'profilePicture',
        bucketName: PUBLIC_BUCKET_NAME,
        isPublic: true,
      };
      files = [...files, ...[upatedPic]];
    }

    const profileDBPayload: ProfileDBPayload = {
      user_id: user!.id,
      first_name: data.firstName,
      last_name: data.lastName,
      user_role: 'DEALER',
      ward: data.selectedWard!,
      document_proof_link: null,
      profile_picture: null,
      deo_documents: null,
      foundation_name: data.foundationName,
    };

    if (files.length) {
      const result = await uploadAllFiles(files);

      if (result.profilePicture) {
        profileDBPayload.profile_picture = result.profilePicture;
      }
      if (result.deoDocuments?.length) {
        profileDBPayload.deo_documents = result.deoDocuments;
      }
      if (result.nidDocuments?.length) {
        profileDBPayload.document_proof_link = result.nidDocuments;
      }
    }

    const response = await createProfile(profileDBPayload);

    if (response.success) {
      handleUpdateData({
        dealerRegistrationData: null,
      });
      clearState();
      handleRefresh();
      router.replace('/');
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    if (dealerRegistrationData) {
      processingAccountCreation(dealerRegistrationData);
    }
  }, []);

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
          <Text style={styles.text}>
            আপনার verification এখনো pending আছে, {'\n'} সিলেট সিটি কর্পোরেশনে
            যোগাযোগ করুন ।
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'flex-end',
            }}
          >
            <Button
              mode="contained"
              buttonColor={COLORS.primary}
              style={styles.btn}
              onPress={() => {
                handleRefresh();
                router.replace('/');
              }}
            >
              Refresh
            </Button>
            <Button
              onPress={() => {
                signOut();
              }}
            >
              Logout
            </Button>
          </View>
        </View>
      )}
    </ScrollViewWithWaterMark>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
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
