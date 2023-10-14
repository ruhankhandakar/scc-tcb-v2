import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

import WaterMarkBackground from 'components/common/WaterMarkBackground';
import ProfileComponent from 'components/profile';
import { COLORS, SIZES } from 'constants/theme';

const UserDetails = () => {
  return (
    <WaterMarkBackground>
      <TouchableOpacity
        style={{
          paddingLeft: SIZES.medium,
        }}
        onPress={() => {
          router.push('/dashboard');
        }}
      >
        <AntDesign name="back" size={24} color={COLORS.lightBlue} />
      </TouchableOpacity>
      <ProfileComponent isReadOnly isEditAccess={false} />
    </WaterMarkBackground>
  );
};

export default UserDetails;
