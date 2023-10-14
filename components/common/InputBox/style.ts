import { StyleSheet } from 'react-native';

import { COLORS, FONT, SIZES } from 'constants/theme';

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SIZES.large,
    height: 50,
  },
  // @ts-ignore
  inputWrapper: (editable) => ({
    flex: 1,
    backgroundColor: editable ? COLORS.onSecondary : COLORS.gray2,
    marginRight: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.medium,
    height: '100%',
  }),
  // @ts-ignore
  inputText: {
    fontFamily: FONT.regular,
    width: '100%',
    height: '100%',
    paddingHorizontal: SIZES.medium,
  },
});

export default styles;
