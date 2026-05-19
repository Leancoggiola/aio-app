import { AppShell, Button, Card, Modal, NavLink, Paper, PasswordInput, TextInput } from '@mantine/core';

import { componentOverrides } from './components.overrides';

import { CaretRightIcon } from '@phosphor-icons/react';

const surfaceBg = 'var(--mantine-color-default)';

export const ComponentsOverride = {
  AppShell: AppShell.extend({
    styles: {
      navbar: { backgroundColor: surfaceBg },
      header: { backgroundColor: surfaceBg },
    },
  }),

  Paper: Paper.extend({
    defaultProps: { p: 'lg', shadow: 'sm', withBorder: false },
    styles: {
      root: { backgroundColor: surfaceBg },
    },
  }),

  Card: Card.extend({
    defaultProps: { shadow: 'sm', withBorder: false, radius: 'md' },
    styles: {
      root: { backgroundColor: surfaceBg },
    },
  }),

  Button: Button.extend({
    defaultProps: { radius: 'md' },
  }),

  Modal: Modal.extend({
    defaultProps: { radius: 'md' },
  }),

  PasswordInput: PasswordInput.extend({ defaultProps: { size: 'md', radius: 'sm' } }),
  TextInput: TextInput.extend({ defaultProps: { size: 'md', radius: 'sm' } }),

  NavLink: NavLink.extend({
    defaultProps: {
      noWrap: true,
      keepMounted: false,
      rightSection: <CaretRightIcon size="1rem" />,
    },
    classNames: componentOverrides.navlink,
  }),
};
