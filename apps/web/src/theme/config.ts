import { createTheme } from '@mantine/core';

import { ComponentsOverride } from './components';
import { GRADIENTS } from './gradients';
import { brandPalette, grayPalette, redPalette, successPalette } from './palettes';
import { RADIUS, SHADOWS } from './tokens';

export const THEME = createTheme({
  fontFamily: "'ui-sans-serif', 'Open Sans', sans-serif",
  primaryColor: 'brand',
  primaryShade: { light: 7, dark: 4 },

  cursorType: 'pointer',
  autoContrast: true,
  black: '#0a0a0a',
  white: '#ffffff',

  colors: {
    brand: brandPalette,
    gray: grayPalette,
    red: redPalette,
    success: successPalette,
  },

  defaultGradient: GRADIENTS.brand,
  other: {
    gradients: GRADIENTS,
  },

  defaultRadius: 'md',
  radius: RADIUS,

  spacing: {
    none: '0',
    '3xs': '0.125rem',
    '2xs': '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
    '4xl': '4rem',
  },

  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '90em',
  },

  shadows: SHADOWS,
  components: ComponentsOverride,
});
