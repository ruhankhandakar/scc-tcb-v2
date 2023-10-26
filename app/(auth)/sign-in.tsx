import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';

import { illustration1 } from 'constants/icons';
import { COLORS, SIZES } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';
import { isValidBangladeshiMobileNumber } from 'utils';
import { useAppContext } from 'context/AppContext';

export default function SignIn() {
  const {
    actions: { loginWithPhoneAndPassword },
  } = useBackEndContext();
  const {
    action: { handleErrorMessage },
  } = useAppContext();

  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!isValidBangladeshiMobileNumber(number)) {
      handleErrorMessage('দয়া করে, বৈধ নম্বর প্রদান করুন');
      return;
    }
    setIsSubmitting(true);
    const response = await loginWithPhoneAndPassword({
      phone: `+880${number}`,
      password,
    });

    if (response.success) {
      router.replace('/');
    }

    setIsSubmitting(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isDisabled = !number.trim() || !password.trim() || password.length < 6;

  return (
    <ScrollViewWithWaterMark>
      <View style={styles.container}>
        <Image
          source={illustration1}
          contentFit="contain"
          style={styles.imgContainer}
        />

        <View style={styles.forms}>
          <View style={styles.inputContainer}>
            <Text style={styles.mobilePrefix}>+880</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNumber}
              value={number}
              placeholder="মোবাইল নাম্বার"
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.darkBlue}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="পাসওয়ার্ড"
              placeholderTextColor={COLORS.darkBlue}
              secureTextEntry={!showPassword}
            />
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowPassword}
            />
          </View>

          <View style={styles.btnContainer}>
            <Button
              mode="contained"
              disabled={isDisabled || isSubmitting}
              loading={isSubmitting}
              style={{
                backgroundColor: isDisabled
                  ? COLORS.surfaceDisabled
                  : COLORS.primary,
              }}
              textColor={isDisabled ? COLORS.onSurfaceDisabled : COLORS.white}
              onPress={handleLogin}
            >
              {isSubmitting ? 'Logging..,' : 'Login'}
            </Button>
          </View>
        </View>

        <View style={styles.registerContainer}>
          <Button
            mode="elevated"
            onPress={() => {
              router.replace('/(auth)/register');
            }}
            textColor={COLORS.error}
            style={{
              height: 40,
            }}
          >
            <Text>অ্যাকাউন্ট নেই? রেজিস্টার করুন</Text>
            <MaterialCommunityIcons
              name="cursor-default-click"
              size={18}
              color={COLORS.error}
            />
          </Button>
        </View>
      </View>
    </ScrollViewWithWaterMark>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: SIZES.medium,
    paddingRight: SIZES.medium,
    marginTop: 50,
  },
  imgContainer: {
    height: 300,
    width: 300,
  },

  forms: {
    width: '100%',
    marginTop: SIZES.small,
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
  },
  input: {
    color: COLORS.darkBlue,
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  mobilePrefix: {
    marginRight: SIZES.medium,
  },
  icon: {
    marginLeft: 10,
  },
  registerContainer: {
    marginTop: SIZES.xSmall,
  },
  btnContainer: {
    margin: 12,
  },
});
