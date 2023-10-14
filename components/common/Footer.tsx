import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, FONT, SIZES } from 'constants/theme';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        © Copyright {new Date().getFullYear()} - Sylhet City Corporation
      </Text>
      <Text style={styles.text}>Powered by NYR Technologies Pvt Ltd</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});
