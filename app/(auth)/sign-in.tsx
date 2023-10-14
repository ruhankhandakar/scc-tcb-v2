import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';

import { illustration1, illustration2 } from 'constants/icons';
import WaterMarkBackground from 'components/common/WaterMarkBackground';
import { COLORS, SIZES } from 'constants/theme';
import { useAuth } from 'context/AuthContext';

export default function SignIn() {
  const { signIn, verifyOtp } = useAuth();
  const router = useRouter();
  const [errMsg, setErrMsg] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userId, setUserId] = useState('');

  const numberRef = useRef('');
  const otpRef = useRef('');

  const handleLogin = async () => {
    console.log(numberRef.current);
    let number = numberRef.current;

    if (!number.trim() || number.length !== 10) {
      setErrMsg('সঠিক মোবাইল নাম্বার দিন');
      return;
    }
    number = `+880${number}`;

    const response = await signIn(number);
    setUserId(response.data?.userId || '');
    if (response.data) {
      setIsOtpSent(true);
    } else {
      setErrMsg(response.error?.message || 'Something went wrong');
    }
  };
  const handleVerification = async () => {
    const response = await verifyOtp(otpRef.current, userId);
    console.log(response);
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <WaterMarkBackground>
        <View style={styles.container}>
          <Image
            source={isOtpSent ? illustration2 : illustration1}
            contentFit="contain"
            style={styles.imgContainer}
          />
          {isOtpSent ? (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder="OTP"
                placeholderTextColor={COLORS.white}
                onChangeText={(text) => {
                  otpRef.current = text;
                }}
                keyboardType="phone-pad"
                onSubmitEditing={handleVerification}
              />
              <Ionicons
                name="keypad-outline"
                size={24}
                color={COLORS.white}
                style={styles.icon}
              />
            </View>
          ) : (
            <View style={styles.textInputContainer}>
              <Text style={styles.prefixText}>+880</Text>
              <TextInput
                style={styles.inputText}
                placeholder="মোবাইল নাম্বার"
                placeholderTextColor={COLORS.white}
                onChangeText={(text) => {
                  numberRef.current = text;
                }}
                keyboardType="phone-pad"
                onSubmitEditing={handleLogin}
              />
              <Ionicons
                name="keypad-outline"
                size={24}
                color={COLORS.white}
                style={styles.icon}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={isOtpSent ? handleVerification : handleLogin}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </WaterMarkBackground>
      <Snackbar
        visible={!!errMsg}
        onDismiss={() => {
          setErrMsg('');
        }}
        action={{
          label: 'Close',
          onPress: () => {
            setErrMsg('');
          },
        }}
      >
        {errMsg}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: SIZES.medium,
    paddingRight: SIZES.medium,
  },
  imgContainer: {
    height: 300,
    width: 300,
  },
  prefixText: {
    color: COLORS.white,
    marginRight: SIZES.medium,
  },
  textInputContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 14,
    borderRadius: 3,
    marginTop: 15,
    backgroundColor: COLORS.darkBlue,
    alignItems: 'center',
  },
  inputText: {
    color: COLORS.white,
    fontSize: 14,
    width: '73%',
    alignSelf: 'center',
  },
  icon: {
    marginRight: 12,
    width: '10%',
    alignSelf: 'flex-start',
  },

  button: {
    padding: 10,
    width: 250,
    borderRadius: 5,
    marginTop: SIZES.xxLarge,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: SIZES.medium,
  },
});
