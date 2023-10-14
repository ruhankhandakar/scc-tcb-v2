import React from 'react';
import { View } from 'react-native';

import Chart from 'components/home/Chart';
import Stats from 'components/home/Stats';

import styles from './styles';

const Dealer = () => {
  return (
    <>
      <View style={styles.parentContainer}>
        <Stats styles={styles} />
        <Chart />
      </View>
    </>
  );
};

export default Dealer;
