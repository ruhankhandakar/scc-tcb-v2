import React from 'react';

import ProfileComponent from 'components/profile';
import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';

import { useBackEndContext } from 'context/BackEndContext';

const SettingPage = () => {
  const {
    state: { loggedInProfileData },
  } = useBackEndContext();

  return (
    <ScrollViewWithWaterMark>
      <ProfileComponent selectedProfile={loggedInProfileData} />
    </ScrollViewWithWaterMark>
  );
};

export default SettingPage;
