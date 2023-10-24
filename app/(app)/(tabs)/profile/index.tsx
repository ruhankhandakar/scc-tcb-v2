import React from 'react';

import WaterMarkBackground from 'components/common/WaterMarkBackground';
import ProfileComponent from 'components/profile';
import { useBackEndContext } from 'context/BackEndContext';

const SettingPage = () => {
  const {
    state: { loggedInProfileData },
  } = useBackEndContext();

  return (
    <WaterMarkBackground>
      <ProfileComponent selectedProfile={loggedInProfileData} />
    </WaterMarkBackground>
  );
};

export default SettingPage;
