import { StyleSheet } from 'react-native';

import { COLORS, FONT, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    position: 'relative',
  },
  pencilIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    zIndex: 2,
    backgroundColor: COLORS.darkBlue,
    borderColor: COLORS.white,
    borderWidth: 2,
    color: COLORS.darkBlue,
  },
  container: {
    flex: 1,
    padding: SIZES.xLarge,
    marginBottom: 100,
  },
  headingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  heading: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.darkBlue,
  },
  btn: {
    marginTop: SIZES.xxLarge,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    fontSize: SIZES.xLarge,
  },
  nidCardContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.onSecondary,
    borderRadius: SIZES.medium,
    padding: SIZES.medium - 3,
    width: '98%',
    marginTop: SIZES.medium,
  },
  nidCardTitle: {
    color: COLORS.gray,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
  },
  infoContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.xLarge,
  },
  infoText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    width: '70%',
  },
  barcodeBtn: {
    width: 40,
    height: 40,
    borderRadius: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkBlue,
  },
  nidFilesContainer: {
    marginTop: SIZES.medium,
  },
  nidFilesText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  nidFilesTextView: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    height: 100,
    width: 100,
    borderRadius: 50,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.black,
    marginTop: SIZES.medium,
  },
  userDob: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  personalInformationContainer: {
    marginTop: SIZES.xxLarge,
  },
  personalInformationTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xSmall,
  },
  personalInformationText: {
    color: COLORS.darkBlue,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
  },
  personalInformationEditWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  utilitiesContainer: {
    marginTop: SIZES.xxLarge,
  },
});

export default styles;
