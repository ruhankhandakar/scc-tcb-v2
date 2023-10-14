import React from 'react';
import {
  PaperProvider,
  MD2DarkTheme as DefaultTheme,
} from 'react-native-paper';

import { COLORS, SIZES } from './constants/theme';

interface Props {
  children: React.ReactNode;
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...COLORS,
  },
  sizes: SIZES,
};

const ThemeProvider: React.FC<Props> = ({ children }) => {
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};

export default ThemeProvider;
