import { StyleSheet } from 'react-native';

import { COLORS, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  parentContainer: {
    padding: SIZES.xLarge,
  },
  dealerContainer: {
    flexDirection: 'row',
    gap: SIZES.medium,
    marginTop: SIZES.xLarge,
  },
  dealerCardTextValue: {
    color: COLORS.secondary,
    fontSize: SIZES.xLarge,
    fontFamily: 'DMBold',
    textAlign: 'center',
    fontWeight: '900',
  },
  dealerCardTitle: {
    color: COLORS.onBackground,
    fontFamily: 'DMRegular',
    fontSize: SIZES.medium,
    textAlign: 'center',
    fontWeight: '500',
    paddingLeft: SIZES.medium,
    paddingRight: SIZES.medium,
    paddingBottom: SIZES.medium,
  },
  spinnerTextStyle: {
    color: COLORS.primary,
  },
});

export default styles;
