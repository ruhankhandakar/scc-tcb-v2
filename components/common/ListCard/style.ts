import { COLORS, FONT, SIZES } from 'constants/theme';
import { StyleSheet } from 'react-native';

//
// ,

const styles = StyleSheet.create({
  // @ts-ignore
  container: (borderPosition: 'top' | 'bottom' | 'both') => ({
    padding: SIZES.xSmall,
    backgroundColor: COLORS.lightPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0.5,
    ...(borderPosition === 'top'
      ? {
          borderTopLeftRadius: SIZES.xSmall,
          borderTopRightRadius: SIZES.xSmall,
        }
      : {}),
    ...(borderPosition === 'bottom'
      ? {
          borderBottomLeftRadius: SIZES.xSmall,
          borderBottomRightRadius: SIZES.xSmall,
        }
      : {}),
    ...(borderPosition === 'both'
      ? {
          borderRadius: 3,
        }
      : {}),
  }),
  leftContainer: {
    flexDirection: 'row',
    gap: SIZES.xSmall - 2,
    alignItems: 'center',
    maxWidth: 100,
  },
  rightContainer: {
    width: '70%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
    flex: 1,
  },
  text: {
    fontFamily: FONT.regular,
    color: COLORS.lightWhite,
    fontSize: SIZES.medium,
    minWidth: '50%',
  },
  valueText: {
    fontFamily: FONT.regular,
    color: COLORS.lightWhite,
    fontSize: SIZES.medium,
    flexShrink: 1,
    maxWidth: 180,
    width: '100%',
    textAlign: 'right',
  },
});

export default styles;
