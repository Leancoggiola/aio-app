import { ActionIcon } from '@mantine/core';
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';

import type { FC } from 'react';

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
