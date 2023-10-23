import AnimatedLottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import OTPTextView from 'react-native-otp-textinput';

import { COLORS, SIZES } from 'constants/theme';
import { otpVerificationLottie } from 'constants/lottie_files';

interface Props {
  handleVerify: (otp: string) => void;
  number: string;
}

const OtpInput: React.FC<Props> = ({ handleVerify, number }) => {
  const [inputText, setInputText] = useState<null | string>();
  const isDisabled = inputText?.length !== 6;

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
});
