import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Snackbar, Button } from 'react-native-paper';

import WaterMarkBackground from 'components/common/WaterMarkBackground';

import { useBackEndContext } from 'context/BackEndContext';
import { illustration1, illustration2 } from 'constants/icons';
import { COLORS, SIZES } from 'constants/theme';
import { validateEmail } from 'utils';

export default function SignIn() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    state: { loading },
    actions: { signUpWithEmail },
  } = useBackEndContext();

  const emailRef = useRef('');
  const passwordRef = useRef('');

  const handleLogin = async () => {
    let email = emailRef.current;
    const password = passwordRef.current;

    if (!validateEmail(email) || !password.trim()) {
      setErrorMessage('সঠিক email ও password দিন');
      return;
    }
    email = email.toLowerCase();
    const response = await signUpWithEmail({ email, password });
  };
  const handleVerification = async () => {};

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
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor={COLORS.white}
              onChangeText={(text) => {
                emailRef.current = text;
              }}
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor={COLORS.white}
              onChangeText={(text) => {
                passwordRef.current = text;
              }}
              secureTextEntry={true}
            />
          </View>

          <Button
            mode="contained"
            style={styles.button}
            onPress={isOtpSent ? handleVerification : handleLogin}
            loading={loading}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Button>
        </View>
      </WaterMarkBackground>
      <Snackbar
        visible={!!errorMessage}
        onDismiss={() => {
          setErrorMessage('');
        }}
        action={{
          label: 'Close',
          onPress: () => {
            setErrorMessage('');
          },
        }}
      >
        {errorMessage}
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
    width: '100%',
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
