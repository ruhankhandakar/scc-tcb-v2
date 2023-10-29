import { StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    flex: 1,
    marginBottom: 0,
  },
  titleContainer: {
    backgroundColor: COLORS.darkBlue,
    padding: SIZES.medium,
    borderRadius: 5,
  },
  title: {
    fontFamily: FONT.bold,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
    color: COLORS.lightWhite,
  },
  linkContainer: {
    marginTop: SIZES.xSmall,
    marginBottom: SIZES.xxLarge,
    paddingLeft: SIZES.medium,
    paddingTop: SIZES.small,
  },
  linkWrapper: {
    flexDirection: 'row',
    gap: SIZES.large,
    marginBottom: SIZES.xSmall,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    fontWeight: 'bold',
    padding: 6,
    flex: 2,
  },
  linkTextLink: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    fontWeight: 'bold',
    flex: 1,
  },
});

export default styles;
