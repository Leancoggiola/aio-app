import { Outlet } from 'react-router-dom';
import { AppShell, Container, Overlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useAuth } from '../auth';
import { Header, Navbar } from './components';

import type { FC } from 'react';

export const RootLayout: FC = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const { user, logout } = useAuth();

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      layout="alt"
      withBorder={false}
      styles={{ root: { '--app-shell-navbar-width': '17.5rem' } }}
    >
      <Header opened={opened} onToggle={toggle} />
      <Navbar user={user} onLogout={logout} onClose={close} toggle={toggle} />

      <AppShell.Main>
        <Container>
          <Overlay hiddenFrom="md" hidden={!opened} color="#000" backgroundOpacity={0.69} blur={2} zIndex={100} />
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
