import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

import WaterMarkBackground from 'components/common/WaterMarkBackground';
import ProfileComponent from 'components/profile';
import { COLORS, SIZES } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';

const UserDetails = () => {
  const {
    state: { selectedProfile },
    actions: { updateState },
  } = useBackEndContext();

  return (
    <WaterMarkBackground>
      <TouchableOpacity
        style={{
          paddingLeft: SIZES.medium,
        }}
        onPress={() => {
          // @ts-ignore
          router.replace('/dashboard');
          updateState('selectedProfile', null);
        }}
      >
        <AntDesign name="back" size={24} color={COLORS.lightBlue} />
      </TouchableOpacity>
      <ProfileComponent
        isReadOnly
        isEditAccess={false}
        selectedProfile={selectedProfile}
      />
    </WaterMarkBackground>
  );
};

export default UserDetails;
