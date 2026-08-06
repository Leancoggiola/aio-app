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

// Neutral Colors
export const DARK = {
  0: '#DDDDDD',
  1: '#CACACA',
  2: '#8F8F8F',
  3: '#5E5E5E',
  4: '#3B3B3B',
  5: '#353535',
  6: '#292929', // base
  7: '#202020',
  8: '#1B1B1B',
  9: '#121212',
} as const;

export const GRAY = {
  0: '#F5F5F5', // 0
  1: '#E0E0E0', // 1
  2: '#CCCCCC', // 2
  3: '#B3B3B3', // 3
  4: '#939393', // 4
  5: '#707070', // 5
  6: '#606060', // 6
  7: '#4D4D4D', // 7
  8: '#232323', // 8 (base)
  9: '#161515', // 9
} as const;

// Semantic Colors
export const BLUE = {
  0: '#E7F5FF',
  1: '#D0EBFF',
  2: '#A5D7FF',
  3: '#68ACE2',
  4: '#4599DE',
  5: '#2D8AD8',
  6: '#1878CB', // base
  7: '#1971C0',
  8: '#1665AE',
  9: '#155999',
} as const;

export const GREEN = {
  0: '#EEFFF1',
  1: '#BEE0C2',
  2: '#90C598',
  3: '#68AD72',
  4: '#489856',
  5: '#348641',
  6: '#277635',
  7: '#1F682C', // base
  8: '#1B5B27',
  9: '#185023',
} as const;

export const RED = {
  0: '#FFF5F5',
  1: '#FFE3E3',
  2: '#FFC9C9',
  3: '#E59797',
  4: '#E57979',
  5: '#E56060',
  6: '#E14949',
  7: '#D83737', // base
  8: '#C92C2C',
  9: '#B41E25',
} as const;

export const ORANGE = {
  0: '#FFF4E6',
  1: '#FFE8CC',
  2: '#FFD8A8',
  3: '#E5AC6C',
  4: '#E59845',
  5: '#E58326',
  6: '#E37111',
  7: '#DE5C06',
  8: '#D3450D', // base
  9: '#C3400D',
} as const;

// Extended Colors
export const INDIGO = {
  0: '#FAF2FF',
  1: '#F6EFFF',
  2: '#EDE0FF',
  3: '#E7D5FF',
  4: '#DAC1FF',
  5: '#CEACFF',
  6: '#A97DF4', // base
  7: '#976AEC',
  8: '#7F51E2',
  9: '#6B3BD9',
  10: '#5826D1',
} as const;

export const LIME = {
  0: '#F5FCDC',
  1: '#EBF8B8',
  2: '#E4F6A1',
  3: '#D6F171',
  4: '#CCEE4E',
  5: '#BBE813',
  6: '#9FD10F',
  7: '#89BF0C', // base
  8: '#71AB08',
  9: '#51830B',
  10: '#3B7F00',
} as const;

export const YELLOW = {
  0: '#FFFADE',
  1: '#FFF5BC',
  2: '#FFF2A6',
  3: '#FFEB7A',
  4: '#FFE658',
  5: '#FFDE21',
  6: '#FFC722',
  7: '#FFB122',
  8: '#FF9723', // base
  9: '#FF8123',
  10: '#FF6D24',
} as const;

export const PINK = {
  0: '#F9D9ED',
  1: '#F2B2DA',
  2: '#EE99CE',
  3: '#E566B6',
  4: '#DF40A3',
  5: '#D40085',
  6: '#BE017A', // base
  7: '#AC0171',
  8: '#970266',
  9: '#85025D',
  10: '#720353',
} as const;

/**
 * Semantic color tokens — Light mode
 */
export const semanticLight = {
  // Text
  '--mantine-color-text-title': GRAY[9],
  '--mantine-color-text-default': GRAY[8],
  '--mantine-color-text-dimmed': GRAY[5],
  '--mantine-color-text-dimmed-hover': GRAY[6],
  '--mantine-color-text-dimmed-disabled': '#7676764d',
  '--mantine-color-text-placeholder': GRAY[4],
  '--mantine-color-text-disabled': GRAY[3],
  '--mantine-color-text-link-default': BRAND[7],
  '--mantine-color-text-link-hover': BRAND[5],
  '--mantine-color-text-link-visited': '#6F4BDF',
  '--mantine-color-text-primary': BRAND[5],
  '--mantine-color-text-primary-hover': BRAND[8],
  '--mantine-color-text-primary-disabled': '#4728254d',
  '--mantine-color-text-error': RED[7],
  '--mantine-color-text-warning': ORANGE[8],
  '--mantine-color-text-success': GREEN[5],
  '--mantine-color-text-info': BLUE[6],
  '--mantine-color-text-destructive': RED[7],
  '--mantine-color-text-destructive-hover': RED[8],
  '--mantine-color-text-destructive-disabled': '#d837374d',
  '--mantine-color-text-white': '#ffffff',
  '--mantine-color-text-black': '#000000',

  // Surfaces
  '--mantine-color-surfaces-primary': BRAND[5],
  '--mantine-color-surfaces-primary-hover': BRAND[8],
  '--mantine-color-surfaces-primary-disabled': '#4728254d',
  '--mantine-color-surfaces-primary-subtle': BRAND[0],
  '--mantine-color-surfaces-primary-light': BRAND[1],
  '--mantine-color-surfaces-destructive': RED[7],
  '--mantine-color-surfaces-destructive-hover': RED[8],
  '--mantine-color-surfaces-destructive-disabled': '#d837374d',
  '--mantine-color-surfaces-destructive-subtle': RED[0],
  '--mantine-color-surfaces-destructive-light': RED[1],
  '--mantine-color-surfaces-dimmed': GRAY[5],
  '--mantine-color-surfaces-dimmed-subtle': GRAY[0],
  '--mantine-color-surfaces-dimmed-light': GRAY[4],
  '--mantine-color-surfaces-dimmed-hover': GRAY[6],
  '--mantine-color-surfaces-dimmed-disabled': '#7676764d',
  '--mantine-color-surfaces-disabled': GRAY[1],
  '--mantine-color-surfaces-white': '#ffffff',
  '--mantine-color-surfaces-device-bg': BRAND[1],
  '--mantine-color-surfaces-overlay': '#000000b0',
  '--mantine-color-surfaces-hover': BRAND[0],
  '--mantine-color-surfaces-hover-destructive': RED[0],
  '--mantine-color-surfaces-info-light': BLUE[0],
  '--mantine-color-surfaces-warning-light': ORANGE[0],
  '--mantine-color-surfaces-success-light': GREEN[0],
  '--mantine-color-surfaces-error-light': RED[1],
  '--mantine-color-surfaces-success-high': GREEN[5],
  '--mantine-color-surfaces-error-high': RED[7],
  '--mantine-color-surfaces-info-high': BLUE[6],
  '--mantine-color-surfaces-warning-high': ORANGE[6],

  // Border
  '--mantine-color-border-primary': BRAND[5],
  '--mantine-color-border-primary-hover': BRAND[8],
  '--mantine-color-border-primary-disabled': '#4728254d',
  '--mantine-color-border-destructive': RED[7],
  '--mantine-color-border-destructive-hover': RED[8],
  '--mantine-color-border-destructive-disabled': '#d837374d',
  '--mantine-color-border-dimmed': GRAY[5],
  '--mantine-color-border-dimmed-light': GRAY[4],
  '--mantine-color-border-dimmed-hover': GRAY[6],
  '--mantine-color-border-dimmed-disabled': '#7676764d',
  '--mantine-color-border-disabled': GRAY[3],
  '--mantine-color-border-error': RED[7],
  '--mantine-color-border-warning': ORANGE[8],
  '--mantine-color-border-success': GREEN[5],
  '--mantine-color-border-info': BLUE[6],
  '--mantine-color-border-onlyread': GRAY[4],
  '--mantine-color-border-focus-tab': '#000000',
  '--mantine-color-border-white': '#ffffff',

  // Icons
  '--mantine-color-icons-primary': BRAND[5],
  '--mantine-color-icons-primary-hover': BRAND[8],
  '--mantine-color-icons-primary-disabled': '#4728254d',
  '--mantine-color-icons-destructive': RED[7],
  '--mantine-color-icons-destructive-hover': RED[8],
  '--mantine-color-icons-destructive-disabled': '#d837374d',
  '--mantine-color-icons-dimmed': GRAY[5],
  '--mantine-color-icons-dimmed-light': GRAY[4],
  '--mantine-color-icons-dimmed-hover': GRAY[6],
  '--mantine-color-icons-dimmed-disabled': '#7676764d',
  '--mantine-color-icons-disabled': GRAY[3],
  '--mantine-color-icons-success': GREEN[5],
  '--mantine-color-icons-warning': ORANGE[8],
  '--mantine-color-icons-info': BLUE[6],
  '--mantine-color-icons-error': RED[7],
  '--mantine-color-icons-white': '#ffffff',
  '--mantine-color-icons-black': '#000000',
} as const;

/**
 * Semantic color tokens — Dark mode
 */
export const semanticDark = {
  // Text
  '--mantine-color-text-title': DARK[0],
  '--mantine-color-text-default': '#ffffff',
  '--mantine-color-text-dimmed': GRAY[2],
  '--mantine-color-text-dimmed-hover': '#ffffff',
  '--mantine-color-text-dimmed-disabled': '#ffffff',
  '--mantine-color-text-placeholder': DARK[3],
  '--mantine-color-text-disabled': DARK[3],
  '--mantine-color-text-primary': BRAND[3],
  '--mantine-color-text-primary-hover': BRAND[3],
  '--mantine-color-text-primary-disabled': '#b97cd54d',
  '--mantine-color-text-error': RED[7],
  '--mantine-color-text-warning': YELLOW[3],
  '--mantine-color-text-success': '#63E6BE',
  '--mantine-color-text-info': BLUE[1],
  '--mantine-color-text-destructive': RED[7],
  '--mantine-color-text-destructive-hover': RED[7],
  '--mantine-color-text-destructive-disabled': '#d837374d',
  '--mantine-color-text-white': '#ffffff',
  '--mantine-color-text-black': '#000000',

  '--mantine-color-text-link-default': BRAND[7],

  // Surfaces
  '--mantine-color-surfaces-primary': BRAND[3],
  '--mantine-color-surfaces-primary-hover': BRAND[8],
  '--mantine-color-surfaces-primary-disabled': '#b97cd54d',
  '--mantine-color-surfaces-primary-subtle': BRAND[7],
  '--mantine-color-surfaces-primary-light': BLUE[6],
  '--mantine-color-surfaces-destructive': RED[3],
  '--mantine-color-surfaces-destructive-hover': RED[4],
  '--mantine-color-surfaces-destructive-disabled': '#ffc9c94d',
  '--mantine-color-surfaces-destructive-subtle': DARK[6],
  '--mantine-color-surfaces-destructive-light': RED[8],
  '--mantine-color-surfaces-dimmed': GRAY[3],
  '--mantine-color-surfaces-dimmed-subtle': DARK[6],
  '--mantine-color-surfaces-dimmed-light': GRAY[3],
  '--mantine-color-surfaces-dimmed-hover': '#ffffff',
  '--mantine-color-surfaces-dimmed-disabled': '#ffffff',
  '--mantine-color-surfaces-disabled': DARK[6],
  '--mantine-color-surfaces-white': '#ffffff',
  '--mantine-color-surfaces-device-bg': GRAY[8],
  '--mantine-color-surfaces-device-bg-onboarding': GRAY[8],
  '--mantine-color-surfaces-overlay': '#b1cef899',
  '--mantine-color-surfaces-hover': '#ffffff',
  '--mantine-color-surfaces-hover-destructive': '#ffffff',
  '--mantine-color-surfaces-info-light': BLUE[6],
  '--mantine-color-surfaces-warning-light': YELLOW[8],
  '--mantine-color-surfaces-success-light': '#099268',
  '--mantine-color-surfaces-error-light': RED[8],
  '--mantine-color-surfaces-success-high': '#099268',
  '--mantine-color-surfaces-error-high': RED[3],
  '--mantine-color-surfaces-info-high': BLUE[3],
  '--mantine-color-surfaces-warning-high': YELLOW[8],

  // Border
  '--mantine-color-border-primary': BRAND[3],
  '--mantine-color-border-primary-hover': BRAND[3],
  '--mantine-color-border-primary-disabled': BRAND[3],
  '--mantine-color-border-destructive': RED[7],
  '--mantine-color-border-destructive-hover': RED[7],
  '--mantine-color-border-destructive-disabled': '#d837374d',
  '--mantine-color-border-dimmed': GRAY[7],
  '--mantine-color-border-dimmed-light': GRAY[3],
  '--mantine-color-border-dimmed-hover': '#ffffff',
  '--mantine-color-border-dimmed-disabled': '#ffffff',
  '--mantine-color-border-disabled': GRAY[7],
  '--mantine-color-border-error': RED[7],
  '--mantine-color-border-warning': YELLOW[3],
  '--mantine-color-border-success': '#63E6BE',
  '--mantine-color-border-info': BLUE[3],
  '--mantine-color-border-onlyread': GRAY[3],
  '--mantine-color-border-focus-tab': GRAY[3],
  '--mantine-color-border-white': GRAY[3],

  // Icons
  '--mantine-color-icons-primary': BRAND[3],
  '--mantine-color-icons-primary-hover': BRAND[2],
  '--mantine-color-icons-primary-disabled': '#b97cd54d',
  '--mantine-color-icons-destructive': RED[7],
  '--mantine-color-icons-destructive-hover': RED[8],
  '--mantine-color-icons-destructive-disabled': '#d837374d',
  '--mantine-color-icons-dimmed': GRAY[4],
  '--mantine-color-icons-dimmed-light': GRAY[3],
  '--mantine-color-icons-dimmed-hover': GRAY[3],
  '--mantine-color-icons-dimmed-disabled': '#9393934d',
  '--mantine-color-icons-disabled': GRAY[6],
  '--mantine-color-icons-success': GREEN[3],
  '--mantine-color-icons-warning': ORANGE[3],
  '--mantine-color-icons-info': BLUE[3],
  '--mantine-color-icons-error': RED[3],
  '--mantine-color-icons-white': '#ffffff',
  '--mantine-color-icons-black': '#000000',
};

/**
 * Compact semantic map for mobile (Tamagui) and legacy consumers.
 * Derived from `semanticLight` / `semanticDark`.
 */
export const SEMANTIC = {
  light: {
    body: semanticLight['--mantine-color-surfaces-device-bg'],
    text: semanticLight['--mantine-color-text-default'],
    card: semanticLight['--mantine-color-surfaces-white'],
    secondary: semanticLight['--mantine-color-surfaces-dimmed-subtle'],
    border: semanticLight['--mantine-color-border-dimmed-light'],
    destructive: semanticLight['--mantine-color-text-destructive'],
    success: semanticLight['--mantine-color-text-success'],
    dimmed: semanticLight['--mantine-color-text-dimmed'],
    placeholder: semanticLight['--mantine-color-text-placeholder'],
    anchor: semanticLight['--mantine-color-text-link-default'],
    primary: semanticLight['--mantine-color-text-primary'],
  },
  dark: {
    body: semanticDark['--mantine-color-surfaces-device-bg'],
    text: semanticDark['--mantine-color-text-default'],
    card: semanticDark['--mantine-color-surfaces-dimmed-subtle'],
    secondary: semanticDark['--mantine-color-surfaces-disabled'],
    border: semanticDark['--mantine-color-border-dimmed'],
    destructive: semanticDark['--mantine-color-text-destructive'],
    success: semanticDark['--mantine-color-text-success'],
    dimmed: semanticDark['--mantine-color-text-dimmed'],
    placeholder: semanticDark['--mantine-color-text-placeholder'],
    anchor: semanticDark['--mantine-color-text-link-default'],
    primary: semanticDark['--mantine-color-text-primary'],
  },
} as const;

export type BrandShade = keyof typeof BRAND;
export type ColorScheme = keyof typeof SEMANTIC;
