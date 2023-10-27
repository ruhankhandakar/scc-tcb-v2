import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Dealer from './Dealer';

import { SIZES } from 'constants/theme';

const Settings = () => {
  return (
    <View style={styles.container}>
      <Dealer />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    marginBottom: 100,
  },
});
