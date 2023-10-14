import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import InputBox from 'components/common/InputBox';

import styles from './styles';
import { COLORS } from 'constants/theme';
import { useAppContext } from 'context/AppContext';

const Registration = () => {
  const {
    state,
    action: { handleUpdateData },
  } = useAppContext();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    name: state.nidBarCode?.name || '',
    phone: '',
    email: '',
    ward: '',
    fullAddress: '',
    foundationName: '',
    nidNumber: state.nidBarCode?.pin || '',
    nidCardFront: state.nidCardFront || '',
    nidCardBack: state.nidCardBack || '',
  });

  useEffect(() => {
    if (state?.nidBarCode) {
      setUserDetails((prevState) => ({
        ...prevState,
        name: state.nidBarCode?.name,
        nidNumber: state.nidBarCode?.pin,
      }));
    }
  }, [state?.nidBarCode]);

  console.log({ state });

  const handleChange =
    (fieldName: keyof typeof userDetails) => (text: string) => {
      setUserDetails((prevState) => ({
        ...prevState,
        [fieldName]: text,
      }));
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

  const handleDeleteFile = (key: string) => {
    setUserDetails((prevState) => ({
      ...prevState,
      [key]: '',
    }));
    handleUpdateData({
      [key]: '',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          handleUpdateData({
            isShowRegistrationForm: false,
          });
        }}
      >
        <AntDesign name="back" size={30} color={COLORS.black} />
      </TouchableOpacity>
      <View style={styles.headingContainer}>
        <Text variant="titleLarge" style={styles.heading}>
          রেজিস্ট্রেশন ফর্ম
        </Text>
      </View>
      <View style={{ ...styles.flexCenter, ...styles.userAvatar }}>
        <TouchableOpacity
          onPress={() => {
            handleCamera('profilePicture', 'camera');
          }}
        >
          {state?.profilePicture ? (
            <Avatar.Image
              size={120}
              source={{
                uri: state?.profilePicture,
              }}
            />
          ) : (
            <Avatar.Icon size={120} icon="account" />
          )}
          <Avatar.Icon size={30} icon="pencil" style={styles.pencilIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          * নাম, NID কার্ড এর জন্য আপনার NID কার্ড এর বার Code scan করুন
        </Text>
        <Button
          mode="contained"
          style={styles.barcodeBtn}
          onPressIn={() => {
            handleCamera('nidBarCode', 'qr-scanner');
          }}
        >
          <AntDesign name="barcode" size={20} color={COLORS.lightWhite} />
        </Button>
      </View>
      <InputBox
        value={userDetails.name}
        onChangeText={handleChange('name')}
        placeholder="আপনার নাম"
      />
      <InputBox
        value={userDetails.phone}
        onChangeText={handleChange('phone')}
        placeholder="মোবাইল নাম্বার"
      />
      <InputBox
        value={userDetails.email}
        onChangeText={handleChange('email')}
        placeholder="ইমেইল"
      />
      <InputBox
        value={userDetails.nidNumber}
        onChangeText={handleChange('nidNumber')}
        placeholder="NID নাম্বার"
      />
      <InputBox
        value={userDetails.foundationName}
        onChangeText={handleChange('foundationName')}
        placeholder="ফাউন্ডেশন নাম"
      />
      <InputBox
        value={userDetails.ward}
        onChangeText={handleChange('ward')}
        placeholder="ওয়ার্ড"
      />
      <InputBox
        value={userDetails.fullAddress}
        onChangeText={handleChange('fullAddress')}
        placeholder="সম্পূর্ণ ঠিকানা"
        multiline
        numberOfLines={4}
      />
      <View>
        <View style={styles.nidCardContainer}>
          <Text style={styles.nidCardTitle}>NID কার্ড - ফ্রন্ট ও ব্যাক এর</Text>
          <TouchableOpacity
            onPress={() => {
              handleCamera(
                state.nidCardFront ? 'nidCardBack' : 'nidCardFront',
                'camera'
              );
            }}
          >
            <MaterialIcons
              name="add-a-photo"
              size={24}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.nidFilesContainer}>
          {!!state.nidCardFront && (
            <View style={styles.nidFilesTextView}>
              <Text style={styles.nidFilesText}>front.jpg</Text>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteFile('nidCardFront');
                }}
              >
                <Entypo name="trash" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
          {!!state.nidCardBack && (
            <View style={styles.nidFilesTextView}>
              <Text style={styles.nidFilesText}>back.jpg</Text>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteFile('nidCardBack');
                }}
              >
                <Entypo name="trash" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Button
        mode="contained"
        onPress={() => console.log('Pressed')}
        style={styles.btn}
      >
        রেজিস্টার
      </Button>
    </View>
  );
};

export default Registration;
