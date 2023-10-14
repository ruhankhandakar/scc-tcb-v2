import React from 'react';
import { View } from 'react-native';

import { CustomerList } from 'components/dashboard';

import styles from 'styles/style';

const index = () => {
  return (
    <View style={styles.sceneContainer}>
      {/* TODO: Filter */}
      <CustomerList />
    </View>
  );
};

export default index;
