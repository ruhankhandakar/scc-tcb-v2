import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import 'dayjs/locale/bn-bd';
import dayjs from 'dayjs';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { ProfileData } from 'types/profile';
import { SIZES, SHADOWS, COLORS, FONT } from 'constants/theme';
import { placeholderUser } from 'constants/icons';
import { useBackEndContext } from 'context/BackEndContext';
import { Tooltip } from 'react-native-paper';

interface Props {
  data: ProfileData;
}

const DealerCard = ({ data }: Props) => {
  const {
    actions: { downloadFile },
  } = useBackEndContext();

  const {
    profile_picture,
    created_at,
    wards,
    foundation_name,
    deo_documents,
    document_proof_link,
    first_name,
    last_name,
    is_verified,
    remarks,
  } = data;
  const handleDownloadFile = async (filePath: string) => {
    try {
      const response = await downloadFile(filePath);
      if (response) {
        await WebBrowser.openBrowserAsync(response);
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      {/* Status */}
      <View style={styles.status}>
        {is_verified ? (
          <Text style={styles.verifiedStatusText}>Verified</Text>
        ) : (
          <Text style={styles.pendingStatusText}>
            {remarks ? <Text>Rejected</Text> : <>Verification{'\n'}Pending</>}
          </Text>
        )}
      </View>
      {/* Profile Pic */}
      <View style={styles.profilePicContainer}>
        <Image
          source={
            profile_picture
              ? {
                  uri: profile_picture,
                }
              : placeholderUser
          }
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
        ব্যবসা প্রতিষ্ঠানের নামঃ{' '}
        <Text style={styles.bold}>{foundation_name}</Text>
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
    </View>
  );
};

export default DealerCard;

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#fff',
    padding: SIZES.medium,
    borderRadius: 10,
    ...SHADOWS.medium,
    marginBottom: SIZES.medium,
    position: 'relative',
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
    marginBottom: SIZES.medium - 16,
  },
  fileListText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium - 2,
    color: COLORS.darkBlue,
  },
  fileViewContainer: {
    flexDirection: 'row',
    gap: SIZES.medium,
  },
  status: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  pendingStatusText: {
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 6,
    padding: 2,
    paddingTop: 2.6,
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    lineHeight: 14,
    color: COLORS.error,
  },
  verifiedStatusText: {
    borderWidth: 1,
    borderColor: COLORS.lightGreenDarken2,
    borderRadius: 6,
    padding: 2,
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.lightGreenDarken2,
  },
});
