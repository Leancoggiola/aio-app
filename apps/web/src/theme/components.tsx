import { NavLink, Paper, PasswordInput, TextInput } from '@mantine/core';

import { componentOverrides } from './components.overrides';

import { CaretRightIcon } from '@phosphor-icons/react';

export const ComponentsOverride = {
  Paper: Paper.extend({
    defaultProps: { p: 'lg', withBorder: true, bd: 'gray.1' },
  }),

  // Inputs
  PasswordInput: PasswordInput.extend({ defaultProps: { size: 'md' } }),
  TextInput: TextInput.extend({ defaultProps: { size: 'md' } }),

  // Navigation
  NavLink: NavLink.extend({
    defaultProps: {
      noWrap: true,
      keepMounted: false,
      rightSection: <CaretRightIcon size="1rem" />,
    },
    classNames: componentOverrides.navlink,
  }),
};
