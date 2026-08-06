export { BRAND, GRAY, SEMANTIC } from '@omni/shared/theme';

export const SHADOWS = {
  xs: '0 1px 2px rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  brand: '0 10px 15px -3px rgb(150 120 111 / 0.2), 0 4px 6px -4px rgb(150 120 111 / 0.2)',
} as const;

export const RADIUS = {
  none: '0',
  xs: '0.125rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;
