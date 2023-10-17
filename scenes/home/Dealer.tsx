import React from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';

import styles from './styles';

const Dealer = () => {
  return (
    <>
      <View style={styles.parentContainer}>
        <Stats styles={styles} />
      </View>
    </>
  );
};

export default Dealer;
