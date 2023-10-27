import AnimatedLottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { Pressable, StyleSheet, View } from 'react-native';
import OTPTextView from 'react-native-otp-textinput';

import { COLORS, SIZES } from 'constants/theme';
import { otpVerificationLottie } from 'constants/lottie_files';
import { useBackEndContext } from 'context/BackEndContext';

interface Props {
  handleVerify: (otp: string) => void;
  number: string;
}

const OtpInput: React.FC<Props> = ({ handleVerify, number }) => {
  const {
    actions: { resendOtp },
  } = useBackEndContext();

  const [inputText, setInputText] = useState<null | string>();
  const [resendOtpCount, setResendOtpCount] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const isDisabled = inputText?.length !== 6;

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    const res = await resendOtp(number);
    if (res.success) {
      setResendOtpCount((prevState) => prevState + 1);
    }
    setIsSendingOtp(false);
  };

  return (
    <View style={styles.container}>
      <AnimatedLottieView
        source={otpVerificationLottie}
        autoPlay
        loop
        style={{
          height: 200,
          width: 200,
        }}
      />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoText}>
          আপনার {number} এই নাম্বারে একটি OTP পাঠানো হয়েছে
        </Text>
      </View>
      <OTPTextView
        handleTextChange={setInputText}
        containerStyle={styles.textInputContainer}
        textInputStyle={styles.roundedTextInput}
        inputCount={6}
        tintColor={COLORS.primary}
      />
      {resendOtpCount < 2 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SIZES.medium,
          }}
        >
          <Pressable
            onPress={() => {
              if (!isSendingOtp) {
                handleResendOtp();
              }
            }}
            android_ripple={{
              color: COLORS.tertiary,
              borderless: true,
              radius: 30,
              foreground: true,
            }}
            style={styles.resendBtn}
          >
            {isSendingOtp ? <Text>Resending...</Text> : <Text>RESNED OTP</Text>}
          </Pressable>
          {!!resendOtpCount && (
            <Text style={{ color: COLORS.error }}>1 Left</Text>
          )}
        </View>
      )}
      <View style={styles.btnContainer}>
        <Button
          mode="contained"
          disabled={isDisabled}
          style={{
            backgroundColor: isDisabled
              ? COLORS.surfaceDisabled
              : COLORS.primary,
          }}
          textColor={isDisabled ? COLORS.onSurfaceDisabled : COLORS.white}
          onPress={() => {
            handleVerify(inputText!);
          }}
        >
          Verify
        </Button>
      </View>
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    marginBottom: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 2,
    width: 40,
    marginRight: 0,
    color: COLORS.darkBlue,
  },
  btnContainer: {
    margin: 12,
  },
  infoTextContainer: {
    marginBottom: SIZES.medium,
  },
  infoText: {
    textAlign: 'center',
    color: COLORS.darkBlue,
    fontSize: SIZES.medium,
  },
  resendBtn: {
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    padding: 4,
    borderRadius: 8,
  },
});
