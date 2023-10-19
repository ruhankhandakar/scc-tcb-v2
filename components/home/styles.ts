import { StyleSheet } from 'react-native';

import { COLORS, SIZES, SHADOWS, FONT } from 'constants/theme';

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

  wardDealerListContainer: {
    marginTop: SIZES.medium,
    paddingLeft: SIZES.medium,
    paddingRight: SIZES.medium,
  },
  headingView: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  wardDealerListCardContainer: {
    marginBottom: SIZES.medium,
  },
  headingViewText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.darkBlue,
  },
  dealerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: SIZES.medium,
    padding: 4,
  },
  dealerLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dealerViewText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium - 3,
    color: COLORS.darkBlue,
    marginTop: 2,
  },
  dealerViewEmptyText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium - 3,
    color: COLORS.gray,
    marginTop: 2,
    marginLeft: 2,
  },
  arrowRight: {
    alignSelf: 'flex-end',
  },
});

export default styles;
