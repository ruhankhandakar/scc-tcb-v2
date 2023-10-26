import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import 'dayjs/locale/bn-bd';
import dayjs from 'dayjs';
import { AntDesign } from '@expo/vector-icons';

import { COLORS, SIZES, SHADOWS, FONT } from 'constants/theme';

const profile_pic =
  'https://jmrqrdddqxuadgbhkfrc.supabase.co/storage/v1/object/public/public_documents/profilePicture/8801728007477_profilePicture.jpg';
const created_at = new Date();
const ward = 'ওয়ার্ড ১';
const foundation_name = 'এহসান ফাউন্ডেশন';

const Card = () => {
  const handleAccept = () => {
    console.log('accept btn');
  };
  const handleReject = () => {
    console.log('reject');
  };
  return (
    <View style={styles.container}>
      {/* Profile Pic */}
      <View style={styles.profilePicContainer}>
        <Image
          source={{
            uri: profile_pic,
          }}
          contentFit="cover"
          style={styles.profilePic}
          cachePolicy="none"
        />
      </View>

      {/* Details */}
      <Text style={styles.nameText}>Niaz Morshed</Text>
      <Text style={styles.joinedAtText}>
        নিবন্ধিত করেছেঃ{' '}
        {dayjs(created_at).locale('bn-bd').format('DD  MMMM YY, A h:m')}
      </Text>
      <Text style={styles.wardText}>{ward}</Text>
      <Text style={styles.foundationText}>
        ফাউন্ডেশন নামঃ <Text style={styles.bold}>{foundation_name}</Text>
      </Text>

      {/* Files Details */}
      <View style={styles.fileListContainer}>
        <View style={styles.fileList}>
          <Text style={styles.fileListText}>জাতীয় পরিচয় পত্র কার্ডঃ</Text>
          <Pressable
            android_ripple={{
              color: COLORS.primary,
              borderless: true,
              radius: 25,
              foreground: true,
            }}
          >
            <AntDesign name="download" size={24} color={COLORS.primary} />
          </Pressable>
        </View>
        <View style={styles.fileList}>
          <Text style={styles.fileListText}>DEO কার্ডঃ</Text>
          <Pressable
            android_ripple={{
              color: COLORS.primary,
              borderless: true,
              radius: 25,
              foreground: true,
            }}
          >
            <AntDesign name="download" size={24} color={COLORS.primary} />
          </Pressable>
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
});
