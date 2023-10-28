import React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Entypo } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons';
import _ from 'lodash';

import FileUploadModal from 'components/common/FileUploadModal';
import OtpInput from 'components/auth/OtpInput';
import SingleDropdown from 'components/common/Dropdown/SingleDropdown';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';
import { FileUploadDocumentKeyName, TWards } from 'types';
import { useAppContext } from 'context/AppContext';
import {
  isMediumStrengthPassword,
  isValidBangladeshiMobileNumber,
} from 'utils';
import { uploadingLottie } from 'constants/lottie_files';
import { MB_2 } from 'constants/data';
import { UpdateParams } from 'utils/types';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  isEditing?: boolean;
  isUpdating?: boolean;
  handleUpdate?: ({
    firstName,
    lastName,
    password,
    profilePicture,
  }: UpdateParams) => void;
}

const RegisterComponent = ({
  containerStyle = {},
  isEditing = false,
  isUpdating = false,
  handleUpdate,
}: Props) => {
  const {
    state: { user, loggedInProfileData, profile },
    actions: { getOnlyWards, signUpWithPhoneAndPassword, verifyOtp },
  } = useBackEndContext();
  const {
    state,
    action: {
      handleErrorMessage,
      handleUpdateData,
      setFileUploadConfig,
      onRegisteredFormDataChange,
    },
  } = useAppContext();
  const router = useRouter();

  const [wardsList, setWardsList] = useState<TWards[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);

  const { fileUploadConfig, registeredFormData } = state;

  const handleChange = (item: number | string) => {
    onRegisteredFormDataChange('selectedWard', +item);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (!isEditing) {
      if (
        registeredFormData.password !== registeredFormData.confirmPassword ||
        !isMediumStrengthPassword(registeredFormData.password)
      ) {
        handleErrorMessage('বৈধ পাসওয়ার্ড প্রদান করুন');
        return;
      }
    }
    if (isEditing) {
      if (
        registeredFormData.password.length > 0 ||
        registeredFormData.confirmPassword.length > 0
      ) {
        if (
          registeredFormData.password !== registeredFormData.confirmPassword ||
          !isMediumStrengthPassword(registeredFormData.password)
        ) {
          handleErrorMessage(
            'বৈধ পাসওয়ার্ড প্রদান করুনবৈধ পাসওয়ার্ড প্রদান করুন'
          );
          return;
        }
      }
    }
    if (
      !isValidBangladeshiMobileNumber(registeredFormData.number) &&
      !isEditing
    ) {
      handleErrorMessage('দয়া করে, বৈধ নম্বর প্রদান করুন');
      return;
    }

    if (isEditing && handleUpdate) {
      handleUpdate({
        firstName: registeredFormData.firstName,
        lastName: registeredFormData.lastName,
        password: registeredFormData.password,
        profilePicture: registeredFormData.profilePicture,
        foundation_name: registeredFormData.foundationName,
      });
      return;
    }
    setSubmitting(true);

    const phoneNumber = `+880${registeredFormData.number}`;

    const response = await signUpWithPhoneAndPassword({
      phone: phoneNumber,
      password: registeredFormData.password,
    });

    if (response.success) {
      setIsOtpVerification(true);
    }

    setSubmitting(false);
  };

  const handleVerify = async (otp: string) => {
    const phoneNumber = `+880${registeredFormData.number}`;

    setSubmitting(true);
    const verifyResponse = await verifyOtp({
      phone: phoneNumber,
      otp: otp,
    });
    if (verifyResponse.success) {
      //? Store all data into context
      handleUpdateData({
        dealerRegistrationData: {
          number: registeredFormData.number,
          firstName: registeredFormData.firstName,
          lastName: registeredFormData.lastName,
          password: registeredFormData.password,
          selectedWard: registeredFormData.selectedWard,
          nidDocuments: registeredFormData.nidDocuments,
          profilePicture: registeredFormData.profilePicture,
          deoDocuments: registeredFormData.deoDocuments,
          foundationName: registeredFormData.foundationName,
        },
      });
      router.replace('/');
    }
    setSubmitting(false);
  };

  const getFileData = (
    documentKeyName: FileUploadDocumentKeyName,
    files: DocumentPicker.DocumentPickerAsset[]
  ) => {
    if (documentKeyName === 'profilePicture') {
      onRegisteredFormDataChange('profilePicture', files[0]);
    } else if (documentKeyName === 'deoDocument') {
      onRegisteredFormDataChange('deoDocuments', files);
    } else if (documentKeyName === 'nidDocuments') {
      onRegisteredFormDataChange('nidDocuments', files);
    }
  };

  useEffect(() => {
    getOnlyWards().then((result) => {
      if (result) {
        setWardsList(result);
      }
    });
  }, []);
  useEffect(() => {
    if (loggedInProfileData) {
      onRegisteredFormDataChange('firstName', loggedInProfileData.first_name!);
      onRegisteredFormDataChange('lastName', loggedInProfileData.last_name!);
      onRegisteredFormDataChange(
        'foundationName',
        loggedInProfileData.foundation_name!
      );
      onRegisteredFormDataChange('profilePicture', {
        uri: loggedInProfileData.profile_picture!,
        name: 'profile_picture.png',
      });
      onRegisteredFormDataChange('password', '');
      onRegisteredFormDataChange('confirmPassword', '');
    }
  }, [loggedInProfileData]);

  const isDisabled =
    (!registeredFormData.number && !isEditing) ||
    !registeredFormData.firstName ||
    !registeredFormData.lastName ||
    (!registeredFormData.foundationName && profile?.user_role === 'DEALER') ||
    (!registeredFormData.password && !isEditing) ||
    (!registeredFormData.confirmPassword && !isEditing) ||
    (!registeredFormData.nidDocuments.length && !isEditing) ||
    (!registeredFormData.deoDocuments.length && !isEditing) ||
    (!registeredFormData.selectedWard && !isEditing);

  return (
    <>
      <Spinner
        visible={submitting || isUpdating}
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
      <View style={[styles.container, containerStyle]}>
        {isOtpVerification ? (
          <OtpInput
            handleVerify={handleVerify}
            number={`+880${registeredFormData.number}`}
          />
        ) : (
          <>
            {/* Registration Form */}
            <View style={styles.formContainer}>
              <Text style={styles.heading}>রেজিস্টার করুন</Text>
              <View style={styles.forms}>
                <View style={{ ...styles.flexCenter, ...styles.userAvatar }}>
                  <TouchableOpacity
                    onPress={() => {
                      setFileUploadConfig({
                        documentKeyName: 'profilePicture',
                        keyName: 'selectedProfilePicture',
                        pathName: 'camera',
                        maxFileSize: MB_2,
                        multiple: false,
                        maxFileSizeAllowed: 1,
                        type: ['image/*'],
                      });
                    }}
                  >
                    {registeredFormData.profilePicture ? (
                      <Avatar.Image
                        size={80}
                        source={{
                          uri: registeredFormData.profilePicture.uri,
                          cache: 'default',
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
                    onChangeText={(text: string) =>
                      onRegisteredFormDataChange('firstName', text)
                    }
                    value={registeredFormData.firstName}
                    placeholder="ফার্স্ট নাম"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text: string) =>
                      onRegisteredFormDataChange('lastName', text)
                    }
                    value={registeredFormData.lastName}
                    placeholder="পদবি (বংশনাম)"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
                {profile?.user_role === 'DEALER' && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text: string) =>
                        onRegisteredFormDataChange('foundationName', text)
                      }
                      value={registeredFormData.foundationName}
                      placeholder="আপনার ব্যবসা প্রতিষ্ঠানের নাম"
                      placeholderTextColor={COLORS.gray}
                    />
                  </View>
                )}
                {!isEditing && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.mobilePrefix}>+880</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text: string) =>
                        onRegisteredFormDataChange('number', text)
                      }
                      value={registeredFormData.number}
                      placeholder="মোবাইল নাম্বার"
                      keyboardType="phone-pad"
                      placeholderTextColor={COLORS.gray}
                    />
                  </View>
                )}
                <View className="password">
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text: string) =>
                        onRegisteredFormDataChange('password', text)
                      }
                      value={registeredFormData.password}
                      placeholder="পাসওয়ার্ড"
                      placeholderTextColor={COLORS.gray}
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
                  <Text style={styles.filePickerInfoText}>
                    <Entypo name="dot-single" size={10} color="black" />
                    সর্বনিম্ন ৬ সঙ্খার {'\n'}
                    <Entypo name="dot-single" size={10} color="black" /> একটি
                    বড় হাতের অক্ষর {'\n'}
                    <Entypo name="dot-single" size={10} color="black" /> একটি
                    ছোটো হাতের অক্ষর {'\n'}
                    <Entypo name="dot-single" size={10} color="black" /> একটি
                    সঙ্খা {'\n'}
                    <Entypo name="dot-single" size={10} color="black" /> একটি
                    বিশেষ সঙ্খা (@/# ..)
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text: string) =>
                      onRegisteredFormDataChange('confirmPassword', text)
                    }
                    value={registeredFormData.confirmPassword}
                    placeholder="কনফার্ম পাসওয়ার্ড"
                    placeholderTextColor={COLORS.gray}
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
                {!isEditing && (
                  <View className="nid">
                    <View
                      style={[
                        styles.inputContainer,
                        { marginBottom: 2, paddingRight: 0 },
                      ]}
                    >
                      <Text>আপলোড জাতীয় পরিচয় পত্র</Text>
                      <Button
                        onPress={() => {
                          setFileUploadConfig({
                            maxFileSizeAllowed: 2,
                            multiple: true,
                            documentKeyName: 'nidDocuments',
                            maxFileSize: MB_2,
                            keyName: 'nidDocuments',
                            pathName: 'camera',
                          });
                        }}
                        style={{
                          borderColor: COLORS.gray2,
                          borderWidth: 1,
                          padding: 0,
                          margin: 0,
                          borderTopRightRadius: 6,
                          borderTopLeftRadius: 6,
                          borderBottomRightRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="file-document"
                          size={20}
                          color={COLORS.darkBlue}
                          style={styles.icon}
                        />
                      </Button>
                    </View>
                    {!!registeredFormData.nidDocuments.length && (
                      <View style={styles.uploadedFileContainer}>
                        {registeredFormData.nidDocuments.map((document) => (
                          <View style={styles.fileView} key={document.uri}>
                            <Text style={styles.uploadFileName}>
                              {document.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <Text style={styles.filePickerInfoText}>
                      <Entypo name="dot-single" size={10} color="black" />{' '}
                      অনুগ্রহ করে, কার্ডের উভয় দিক আপলোড করুন {'\n'}
                      <Entypo name="dot-single" size={10} color="black" />{' '}
                      প্রতিটি ফাইল সাইজ সর্বোচ্চ 2 MB
                    </Text>
                  </View>
                )}
                {!isEditing && (
                  <View className="deo">
                    <View
                      style={[
                        styles.inputContainer,
                        { marginBottom: 2, paddingRight: 0 },
                      ]}
                    >
                      <Text>আপলোড DEO ফাইল</Text>
                      <Button
                        onPress={() => {
                          setFileUploadConfig({
                            maxFileSize: MB_2,
                            maxFileSizeAllowed: 1,
                            documentKeyName: 'deoDocument',
                            keyName: 'deoDocument',
                            pathName: 'camera',
                          });
                        }}
                        style={{
                          borderColor: COLORS.gray2,
                          borderWidth: 1,
                          padding: 0,
                          margin: 0,
                          borderTopRightRadius: 6,
                          borderTopLeftRadius: 6,
                          borderBottomRightRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="file-document"
                          size={20}
                          color={COLORS.darkBlue}
                          style={styles.icon}
                        />
                      </Button>
                    </View>
                    {!!registeredFormData.deoDocuments.length && (
                      <View style={styles.uploadedFileContainer}>
                        {registeredFormData.deoDocuments.map((document) => (
                          <View style={styles.fileView} key={document.uri}>
                            <Text style={styles.uploadFileName}>
                              {document.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <Text style={styles.filePickerInfoText}>
                      <Entypo name="dot-single" size={10} color="black" />{' '}
                      প্রতিটি ফাইল সাইজ সর্বোচ্চ 2 MB
                    </Text>
                    <Text style={styles.filePickerInfoText}></Text>
                  </View>
                )}
                {!!wardsList?.length && !isEditing && (
                  <SingleDropdown
                    data={wardsList.map((ward) => ({
                      label: ward.name,
                      value: ward.id,
                    }))}
                    handleChange={handleChange}
                    placeholder="ওয়ার্ড সিলেক্ট করুন"
                    selectedValue={
                      registeredFormData.selectedWard
                        ? registeredFormData.selectedWard.toString()
                        : null
                    }
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
                    {isEditing ? 'Update' : 'Submit'}
                  </Button>
                </View>

                {!user && (
                  <Button
                    onPress={() => {
                      router.replace('/sign-in');
                    }}
                  >
                    <AntDesign name="back" size={16} color={COLORS.primary} />
                    <Text
                      style={{
                        color: COLORS.primary,
                      }}
                    >
                      Back to Login
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </>
        )}
      </View>
      {!!fileUploadConfig && (
        <FileUploadModal
          visible
          toggleModal={() => {
            setFileUploadConfig(null);
          }}
          handleSubmit={getFileData}
          {...fileUploadConfig}
        />
      )}
    </>
  );
};

export default RegisterComponent;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    marginTop: SIZES.xLarge,
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
