/** Omni brand scale (0 = lightest). Direction A — keep & refine. */
export const BRAND = {
  0: '#FFF4E2',
  1: '#FDE4BC',
  2: '#E8C9A2',
  3: '#D3AB80',
  4: '#C4A484',
  5: '#96786F',
  6: '#6B4A45',
  7: '#472825',
  8: '#3A211F',
  9: '#2E1A18',
} as const;

/** Warm neutrals (hue aligned to brand). Index matches Mantine gray tuple. */
export const GRAY = {
  0: '#FAF7F2',
  1: '#F5EDE3',
  2: '#E8D9C8',
  3: '#D4C4B0',
  4: '#A89888',
  5: '#7A5F56',
  6: '#5C4A42',
  7: '#3A322C',
  8: '#2A241F',
  9: '#221C18',
} as const;

/** Destructive scale — index 6 is the default filled shade. */
export const DESTRUCTIVE = {
  0: '#FDF2F0',
  1: '#F8D9D4',
  2: '#F0B5AC',
  3: '#E58C7E',
  4: '#D66A58',
  5: '#C44F3C',
  6: '#B33A2B',
  7: '#9A3226',
  8: '#7A281E',
  9: '#5C1E16',
} as const;

/** Success scale — index 6 is the default filled shade. */
export const SUCCESS = {
  0: '#F0F7F3',
  1: '#D8EBE1',
  2: '#B3D6C4',
  3: '#86BBA0',
  4: '#5C9D7C',
  5: '#458463',
  6: '#3D6B4F',
  7: '#345A43',
  8: '#2A4836',
  9: '#1F3628',
} as const;

export const SEMANTIC = {
  light: {
    body: BRAND[0],
    text: '#0a0a0a',
    card: '#FFFBF5',
    secondary: GRAY[1],
    border: GRAY[2],
    destructive: DESTRUCTIVE[6],
    success: SUCCESS[6],
    dimmed: '#7A5F56',
    placeholder: BRAND[5],
    anchor: BRAND[7],
    primary: BRAND[7],
  },
  dark: {
    body: '#161210',
    text: '#fafafa',
    card: '#221C18',
    secondary: GRAY[8],
    border: GRAY[7],
    destructive: '#E07060',
    success: '#7CB89A',
    dimmed: '#B89A8C',
    placeholder: '#B89A8C',
    anchor: BRAND[3],
    primary: BRAND[4],
  },
} as const;

/** Warm-tinted scrim over posters / media chrome. */
export const OVERLAY = {
  poster: 'rgb(20 16 12 / 0.65)',
} as const;

export type BrandShade = keyof typeof BRAND;
export type ColorScheme = keyof typeof SEMANTIC;
