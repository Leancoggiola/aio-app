import type { GRADIENTS } from './gradients';

declare module '@mantine/core' {
  export interface MantineThemeOther {
    gradients: typeof GRADIENTS;
  }

  export interface MantineThemeSizesOverride {
    shadows: Record<'xs' | 'sm' | 'md' | 'lg' | 'brand', string>;
  }
}
