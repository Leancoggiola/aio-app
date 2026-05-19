import { ActionIcon } from '@mantine/core';
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

import type { FC } from 'react';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';

export const ColorSchemeToggle: FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <ActionIcon
      variant="subtle"
      size="lg"
      onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
    >
      {computedColorScheme === 'dark' ? <SunIcon size="1rem" /> : <MoonIcon size="1rem" />}
    </ActionIcon>
  );
};
