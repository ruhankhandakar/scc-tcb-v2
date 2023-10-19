import { StyleSheet } from 'react-native';

import { COLORS, FONT, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 100,
  },
  footerContainer: {
    marginTop: SIZES.small,
  },
  noDataImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.xxLarge,
  },
  noDataImg: {
    height: '90%',
    width: '50%',
  },
  noDataText: {
    color: COLORS.error,
    fontFamily: FONT.medium,
    fontSize: SIZES.xLarge,
  },

  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
  endText: {
    color: COLORS.error,
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  totalNumberText: {
    color: COLORS.darkBlue,
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
});

export default styles;
