export const BRAND = {
  0: '#FFF4E2',
  1: '#FDE4BC',
  2: '#E8C9A2',
  3: '#D3AB80',
  4: '#B89379',
  5: '#96786F',
  6: '#6B4A45',
  7: '#472825',
  8: '#3A211F',
  9: '#2E1A18',
} as const;

export const SEMANTIC = {
  light: {
    body: BRAND[0],
    text: '#0a0a0a',
    card: '#ffffff',
    secondary: '#f5f5f5',
    border: '#e5e5e5',
    destructive: '#ff4444',
    dimmed: BRAND[5],
    placeholder: BRAND[3],
    anchor: BRAND[7],
  },
  dark: {
    body: '#0a0a0a',
    text: '#fafafa',
    card: '#171717',
    secondary: '#262626',
    border: '#262626',
    destructive: '#ff4444',
    dimmed: BRAND[5],
    placeholder: BRAND[5],
    anchor: BRAND[3],
  },
} as const;

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
