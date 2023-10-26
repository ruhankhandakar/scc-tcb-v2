import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT, SIZES } from 'constants/theme';
import Card from './Card';

const numbers = Array.from({ length: 70 }, (_, index) => index + 1);

const Actions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.pendingActionsText}>Pending Actions</Text>
      <View style={styles.cardListContainer}>
        {numbers.map((num) => (
          <View style={styles.cardView} key={num}>
            <Card />
          </View>
        ))}
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
  cardView: {
    marginBottom: SIZES.medium,
  },
});
