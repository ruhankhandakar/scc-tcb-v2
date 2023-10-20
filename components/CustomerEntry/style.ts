import { StyleSheet } from 'react-native';

import { COLORS, FONT, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    marginBottom: 100,
  },
  profilePic: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  imageParenContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  profileImageContainer: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    height: 100,
    width: 100,
    borderRadius: 50,
    elevation: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerDetailsContainer: {
    marginTop: SIZES.medium,
    padding: SIZES.medium,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: SIZES.small,
  },
  textView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  labelText: {
    color: COLORS.primary,
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

  productDetailsContainer: {},
  productHeading: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    textAlign: 'left',
    color: COLORS.tertiary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray2,
    paddingBottom: 4,
  },
  productListContainer: {
    marginTop: SIZES.small,
  },
  checkBoxLabel: {
    color: COLORS.black,
    fontSize: SIZES.small + 3,
    fontFamily: FONT.medium,
  },
  checkBoxContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  actionContainer: {
    marginTop: SIZES.xLarge,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 100,
  },
  cancelText: {},
});

export default styles;
