import { BRAND } from './tokens';

import type { MantineGradient } from '@mantine/core';

export const GRADIENTS = {
  brand: {
    from: BRAND[5],
    to: BRAND[7],
    deg: 90,
  },
} as const satisfies Record<string, MantineGradient>;
