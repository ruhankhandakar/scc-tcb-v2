import { StyleSheet } from 'react-native';

// import { COLORS, FONT, SIZES } from "../../../constants";
import { COLORS, FONT, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  userName: {
    fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  welcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 2,
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SIZES.large,
    height: 50,
    marginVertical: SIZES.medium,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginRight: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.small,
    height: '100%',
  },
  searchInput: {
    fontFamily: FONT.regular,
    width: '100%',
    height: '100%',
    paddingHorizontal: SIZES.small,
  },
  searchBtn: {
    width: 50,
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnImage: {
    width: '50%',
    height: '50%',
    tintColor: COLORS.white,
  },
});

export default styles;
