const COLORS = {
  gray: '#83829A',
  gray2: '#C1C0C8',

  white: '#F3F4F8',
  black: '#000',
  lightWhite: '#FAFAFC',

  primary: 'rgb(112, 41, 239)',
  onPrimary: 'rgb(255, 255, 255)',
  primaryContainer: 'rgb(233, 221, 255)',
  onPrimaryContainer: 'rgb(35, 0, 91)',
  secondary: 'rgb(0, 103, 131)',
  onSecondary: 'rgb(255, 255, 255)',
  secondaryContainer: 'rgb(189, 233, 255)',
  onSecondaryContainer: 'rgb(0, 31, 42)',
  tertiary: 'rgb(0, 106, 101)',
  onTertiary: 'rgb(255, 255, 255)',
  tertiaryContainer: 'rgb(112, 247, 238)',
  onTertiaryContainer: 'rgb(0, 32, 30)',
  error: 'rgb(186, 26, 26)',
  onError: 'rgb(255, 255, 255)',
  errorContainer: 'rgb(255, 218, 214)',
  onErrorContainer: 'rgb(65, 0, 2)',
  background: 'rgb(255, 251, 255)',
  onBackground: 'rgb(28, 27, 30)',
  surface: 'rgb(255, 251, 255)',
  onSurface: 'rgb(28, 27, 30)',
  surfaceVariant: 'rgb(231, 224, 235)',
  onSurfaceVariant: 'rgb(73, 69, 78)',
  outline: 'rgb(122, 117, 127)',
  outlineVariant: 'rgb(202, 196, 207)',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(50, 48, 51)',
  inverseOnSurface: 'rgb(245, 239, 244)',
  inversePrimary: 'rgb(208, 188, 255)',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(248, 241, 254)',
    level2: 'rgb(244, 234, 254)',
    level3: 'rgb(239, 228, 253)',
    level4: 'rgb(238, 226, 253)',
    level5: 'rgb(235, 222, 253)',
  },
  surfaceDisabled: '#9BB1FF',
  onSurfaceDisabled: '#232B5D',
  backdrop: 'rgba(50, 47, 55, 0.4)',
  lightBackground: 'rgb(0, 106, 101)',
  onLightBackground: 'rgb(255, 255, 255)',
  lightBackgroundContainer: 'rgb(112, 247, 239)',
  onLightBackgroundContainer: 'rgb(0, 32, 30)',

  darkBlue: '#232B5D',
  lightBlue: '#565890',
  lightPrimary: '#9465E9',

  chartPrimaryFrontColor: '#006DFF',
  chartPrimaryGradientColor: '#009FFF',
  chartSecondaryFrontColor: '#3BE9DE',
  chartSecondaryGradientColor: '#93FCF8',
};

const FONT = {
  regular: 'DMRegular',
  medium: 'DMMedium',
  bold: 'DMBold',
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
