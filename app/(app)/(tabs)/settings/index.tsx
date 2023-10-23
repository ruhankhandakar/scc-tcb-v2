import React from 'react';
import { View, Text } from 'react-native';

import WaterMarkBackground from 'components/common/WaterMarkBackground';
import HelpScene from 'scenes/help';

import styles from 'styles/style';

const HelpPage = () => {
  return (
    <WaterMarkBackground>
      <HelpScene />
    </WaterMarkBackground>
  );
};

export default HelpPage;
