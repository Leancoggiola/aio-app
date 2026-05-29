import type { DefaultMantineSize } from '@mantine/core';

import type { GRADIENTS } from './gradients';

type AppSpacing = 'none' | '3xs' | '2xs' | '4xl' | DefaultMantineSize;

declare module '@mantine/core' {
  export interface MantineThemeOther {
    gradients: typeof GRADIENTS;
  }

  export interface MantineThemeSizesOverride {
    shadows: Record<'xs' | 'sm' | 'md' | 'lg' | 'brand', string>;
    spacing: Record<AppSpacing, string>;
  }
}
