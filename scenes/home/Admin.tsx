import React from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';

import styles from './styles';

const Admin = () => {
  return (
    <View style={styles.parentContainer}>
      <Stats styles={styles} />
    </View>
  );
};

export default Admin;
