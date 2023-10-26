import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT, SIZES } from 'constants/theme';
import Card from './Card';

const Actions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.pendingActionsText}>Pending Actions</Text>
      <View style={styles.cardListContainer}>
        <Card />
      </View>
    </View>
  );
};

export default Actions;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
    borderWidth: 2,
    borderColor: COLORS.gray2,
    borderRadius: 3,
    padding: SIZES.small,
  },
  pendingActionsText: {
    fontFamily: FONT.bold,
    color: COLORS.darkBlue,
    fontSize: SIZES.large,
    textDecorationLine: 'underline',
  },
  cardListContainer: {
    marginTop: SIZES.medium,
  },
});
