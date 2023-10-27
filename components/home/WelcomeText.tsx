import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, FONT, SIZES } from 'constants/theme';

interface Props {
  firstName: string;
  lastName: string;
}

const WelcomeText = ({ firstName, lastName }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        👋🏻 Welcome{' '}
        <Text style={styles.bold}>
          {firstName} {lastName}
        </Text>
      </Text>
    </View>
  );
};

export default WelcomeText;

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  text: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.outline,
  },
  bold: {
    fontWeight: 'bold',
  },
});
