import { COLORS, FONT, SIZES, SHADOWS } from 'constants/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: SIZES.small,
    borderRadius: SIZES.small,
    backgroundColor: '#FFF',
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
    marginBottom: SIZES.medium,
  },
  leftContainer: {
    flexDirection: 'row',
    gap: SIZES.small,
    alignItems: 'center',
  },
  logoImage: {
    height: 50,
    width: 50,
    borderRadius: 35,
  },
  textViewsContainer: {
    flex: 1,
  },
  textView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  labelText: {
    color: COLORS.darkBlue,
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
  },
  valueText: {
    color: COLORS.darkBlue,
    fontFamily: FONT.bold,
    fontSize: SIZES.small,
    textAlign: 'right',
    maxWidth: 180,
    flexShrink: 1,
  },
  divider: {
    flex: 1,
    height: 1,
    width: 150,
    backgroundColor: COLORS.gray,
    marginVertical: SIZES.medium,
    alignSelf: 'center',
  },
});

export default styles;
