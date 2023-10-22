import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Entypo } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import LottieView from 'lottie-react-native';
import * as FileSystem from 'expo-file-system';

import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';
import SingleDropdown from 'components/common/Dropdown/SingleDropdown';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';
import { TWards } from 'types';
import { useAppContext } from 'context/AppContext';
import _ from 'lodash';
import { isValidBangladeshiMobileNumber } from 'utils';
import { uploadingLottie } from 'constants/lottie_files';
import OtpInput from 'components/auth/OtpInput';

const MAX_FILE_SIZE = 500000; // 500 KB

const register = () => {
  const {
    actions: {
      getOnlyWards,
      uploadFile,
      signUpWithPhoneAndPassword,
      verifyOtp,
    },
  } = useBackEndContext();
  const {
    state,
    action: { handleErrorMessage },
  } = useAppContext();
  const router = useRouter();

  const [number, setNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedWard, setSelectedWard] = useState<null | number>(null);
  const [wardsList, setWardsList] = useState<TWards[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [nidDocuments, setNidDocuments] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);
  const [isFileSelecting, setIsFileSelecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);

  const handleChange = (item: number | string) => {
    setSelectedWard(+item);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePickDocument = async () => {
    try {
      setIsFileSelecting(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/webp',
          'application/*',
        ],
        multiple: true,
      });
      console.log('result', result);

      const files = result.assets || [];

      if (files?.length === 2) {
        let errorFileNames: string[] = [];

        files.forEach((file) => {
          if (file.size! > MAX_FILE_SIZE) {
            errorFileNames.push(file.name);
          }
        });

        if (errorFileNames.length) {
          handleErrorMessage(
            `${errorFileNames.join(', ')} ফাইলর সাইজ 500 KB এর থেকে বেশি`
          );
        } else {
          setNidDocuments(files);
        }
      } else {
        handleErrorMessage('শুধুমাত্র দুইটি ফাইল সিলেক্ট করুন');
      }
    } catch (error) {
    } finally {
      setIsFileSelecting(false);
    }
  };

  const handleCamera = (key: string, pathName: string) => {
    // @ts-ignore
    router.push({
      pathname: pathName,
      params: {
        key,
      },
    });
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword || password.length !== 6) {
      handleErrorMessage(
        'পাসওয়ার্ড same হতে হবে এবং মিনিমাম ৬ সংখ্যার হতে হবে'
      );
      return;
    }
    if (!isValidBangladeshiMobileNumber(number)) {
      handleErrorMessage('দয়া করে, বৈধ নম্বর প্রদান করুন');
      return;
    }
    setSubmitting(true);

    const phoneNumber = `+880${number}`;

    const response = await signUpWithPhoneAndPassword({
      phone: phoneNumber,
      password,
    });

    if (response.success) {
      setIsOtpVerification(true);
    }

    // const base64 = await FileSystem.readAsStringAsync(payload.profilePicture, {
    //   encoding: 'base64',
    // });
    // const filePath = `user_profile_${payload.number}.jpeg`;
    // const contentType = 'image/jpeg';

    // await uploadFile(`profile_picture/${filePath}`, base64, contentType);

    setSubmitting(false);
  };

  const handleVerify = async (otp: string) => {
    const phoneNumber = `+880${number}`;

    setSubmitting(true);
    const verifyResponse = await verifyOtp({
      phone: phoneNumber,
      otp: otp,
    });
    if (verifyResponse.success) {
      // TODO:Store all data into context
      // TODO: Upload all things from Customer page
      // TODO: After then do the sign out, so that user can login with DEALER access
    }
    setSubmitting(false);
  };

  useEffect(() => {
    getOnlyWards().then((result) => {
      if (result) {
        setWardsList(result);
      }
    });
  }, []);

  const isDisabled =
    !number ||
    !firstName ||
    !lastName ||
    !password ||
    !selectedWard ||
    nidDocuments.length !== 2;

  return (
    <ScrollViewWithWaterMark>
      <Spinner
        visible={submitting}
        textContent={'সাবমিট হচ্ছে... অনুগ্রহ করে এই স্ক্রীনে থাকুন'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(0,0,0,0.5)"
        customIndicator={
          <LottieView
            source={uploadingLottie}
            autoPlay
            loop
            style={{
              height: 150,
              width: 150,
            }}
          />
        }
      />
      <View style={styles.container}>
        {isOtpVerification ? (
          <OtpInput handleVerify={handleVerify} />
        ) : (
          <>
            {/* Registration Form */}
            <View style={styles.formContainer}>
              <Text style={styles.heading}>রেজিস্টার করুন</Text>
              <View style={styles.forms}>
                <View style={{ ...styles.flexCenter, ...styles.userAvatar }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleCamera('profilePicture', 'camera');
                    }}
                  >
                    {state.profilePicture ? (
                      <Avatar.Image
                        size={80}
                        source={{
                          uri: state.profilePicture,
                        }}
                      />
                    ) : (
                      <Avatar.Icon size={80} icon="account" />
                    )}
                    <Avatar.Icon
                      size={20}
                      icon="camera"
                      style={styles.pencilIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setFirstName}
                    value={firstName}
                    placeholder="ফার্স্ট নাম"
                    placeholderTextColor={COLORS.darkBlue}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setLastName}
                    value={lastName}
                    placeholder="পদবি (বংশনাম)"
                    placeholderTextColor={COLORS.darkBlue}
                  />
                </View>
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
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    placeholder="কনফার্ম পাসওয়ার্ড"
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
                <View>
                  <View
                    style={[
                      styles.inputContainer,
                      { marginBottom: 2, paddingRight: 0 },
                    ]}
                  >
                    <Text>আপলোড জাতীয় পরিচয় পত্র</Text>
                    {!isFileSelecting && (
                      <Button
                        onPress={() => {
                          handlePickDocument();
                        }}
                        style={{
                          borderColor: COLORS.darkBlue,
                          borderWidth: 1,
                          padding: 0,
                          margin: 0,
                          borderTopRightRadius: 6,
                          borderBottomRightRadius: 6,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="file-document"
                          size={40}
                          color={COLORS.darkBlue}
                          style={styles.icon}
                          onPress={toggleShowPassword}
                        />
                      </Button>
                    )}
                  </View>
                  {!!nidDocuments.length && (
                    <View style={styles.uploadedFileContainer}>
                      {nidDocuments.map((document) => (
                        <View style={styles.fileView} key={document.uri}>
                          <Text style={styles.uploadFileName}>
                            {document.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text style={styles.filePickerInfoText}>
                    <Entypo name="dot-single" size={10} color="black" /> অনুগ্রহ
                    করে, কার্ডের উভয় দিক আপলোড করুন {'\n'}
                    <Entypo name="dot-single" size={10} color="black" /> প্রতিটি
                    ফাইল সাইজ সর্বোচ্চ 500 KB
                  </Text>
                </View>
                {!!wardsList?.length && (
                  <SingleDropdown
                    data={wardsList.map((ward) => ({
                      label: ward.name,
                      value: ward.id,
                    }))}
                    handleChange={handleChange}
                    placeholder="ওয়ার্ড সিলেক্ট করুন"
                  />
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
                    textColor={
                      isDisabled ? COLORS.onSurfaceDisabled : COLORS.white
                    }
                    onPress={handleSubmit}
                  >
                    Submit
                  </Button>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollViewWithWaterMark>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    flex: 1,
  },
  lottieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: SIZES.xLarge,
  },
  heading: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge - 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.darkBlue,
  },
  forms: {
    marginTop: SIZES.xLarge,
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
  icon: {
    marginLeft: 10,
  },
  btnContainer: {
    margin: 12,
  },
  pencilIcon: {
    position: 'absolute',
    right: 1,
    bottom: 5,
    zIndex: 2,
    backgroundColor: COLORS.darkBlue,
    borderColor: COLORS.white,
    borderWidth: 2,
    color: COLORS.darkBlue,
  },
  userAvatar: {
    position: 'relative',
    marginBottom: SIZES.medium,
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePickerInfoText: {
    color: '#808080',
    fontSize: SIZES.small,
    marginLeft: 12,
    marginBottom: 12,
  },
  uploadedFileContainer: {
    margin: 12,
  },
  fileView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadFileName: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small + 3,
  },
  mobilePrefix: {
    marginRight: SIZES.medium,
  },
  spinnerTextStyle: {
    color: '#fff',
    fontSize: 18,
    marginTop: SIZES.xLarge,
    textAlign: 'center',
    paddingLeft: SIZES.small,
    paddingRight: SIZES.small,
  },
});
