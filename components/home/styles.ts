import { StyleSheet } from 'react-native';

import { COLORS, SIZES, SHADOWS } from 'constants/theme';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

const styles = StyleSheet.create({
  // @ts-ignore
  cardContainer: (backgroundColor) => ({
    flex: 1,
    backgroundColor: backgroundColor || COLORS.background,
    borderRadius: SIZES.medium,
    ...SHADOWS.medium,
  }),
  cardView: {
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.medium,
  },
  chartTextStyle: {
    fontFamily: 'DMMedium',
    color: COLORS.lightWhite,
    marginLeft: SIZES.small,
  },
  // @ts-ignore
  boxStyle: (backgroundColor) => ({
    height: SIZES.medium,
    width: SIZES.medium,
    backgroundColor: backgroundColor,
    borderRadius: 3,
  }),
  chartLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.xSmall,
  },
  chartContainer: {
    marginTop: SIZES.medium,
    marginBottom: SIZES.xSmall,
    padding: SIZES.medium,
    borderRadius: SIZES.large,
  },
  chartHeading: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    fontFamily: 'DMBold',
  },
  linearBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: SIZES.large,
  },
});

export default styles;
