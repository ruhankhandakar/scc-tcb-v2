import React from 'react';
import { Text } from 'react-native-paper';
import { View } from 'react-native';

import CustomCard from 'components/home/Card';

// @ts-ignore
const Stats = ({ styles }) => {
  return (
    <View style={styles.dealerContainer}>
      <CustomCard>
        <>
          <Text variant="headlineSmall" style={styles.dealerCardTitle}>
            নিবন্ধিত {'\n'} উপকারভোগী
          </Text>
          <Text variant="headlineMedium" style={styles.dealerCardTextValue}>
            2001
          </Text>
        </>
      </CustomCard>
      <CustomCard>
        <>
          <Text variant="headlineSmall" style={styles.dealerCardTitle}>
            সুবিধাপ্রাপ্ত {'\n'} উপকারভোগী
          </Text>
          <Text variant="headlineMedium" style={styles.dealerCardTextValue}>
            2001
          </Text>
        </>
      </CustomCard>
    </View>
  );
};

export default Stats;
