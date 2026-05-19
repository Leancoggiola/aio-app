import { SEMANTIC } from './tokens';

import type { CSSVariablesResolver } from '@mantine/core';

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': SEMANTIC.light.body,
    '--mantine-color-text': SEMANTIC.light.text,
    '--mantine-color-bright': SEMANTIC.light.text,
    '--mantine-color-default': SEMANTIC.light.card,
    '--mantine-color-default-hover': SEMANTIC.light.secondary,
    '--mantine-color-default-border': SEMANTIC.light.border,
    '--mantine-color-error': SEMANTIC.light.destructive,
    '--mantine-color-dimmed': SEMANTIC.light.dimmed,
    '--mantine-color-placeholder': SEMANTIC.light.placeholder,
    '--mantine-color-anchor': SEMANTIC.light.anchor,
  },
  dark: {
    '--mantine-color-body': SEMANTIC.dark.body,
    '--mantine-color-text': SEMANTIC.dark.text,
    '--mantine-color-bright': SEMANTIC.dark.text,
    '--mantine-color-default': SEMANTIC.dark.card,
    '--mantine-color-default-hover': SEMANTIC.dark.secondary,
    '--mantine-color-default-border': SEMANTIC.dark.border,
    '--mantine-color-error': SEMANTIC.dark.destructive,
    '--mantine-color-dimmed': SEMANTIC.dark.dimmed,
    '--mantine-color-placeholder': SEMANTIC.dark.placeholder,
    '--mantine-color-anchor': SEMANTIC.dark.anchor,
  },
});
