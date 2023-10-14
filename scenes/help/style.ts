import { StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    flex: 1,
    marginBottom: 100,
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
    paddingTop: SIZES.medium,
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
    flexShrink: 1,
  },
  linkTextLink: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    fontWeight: 'bold',
    flexShrink: 1,
  },
});

export default styles;
