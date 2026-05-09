import { AppShell, Burger, Container, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

const NAV_ITEMS = [
  { label: "Inicio", path: "/" },
  { label: "Media Tracker", path: "/media" },
];

export const RootLayout: FC = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header bg="primary.9">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <AppShell.Section grow>
          <Stack gap={4}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                active={
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path)
                }
                onClick={() => {
                  navigate(item.path);
                  close();
                }}
              />
            ))}
          </Stack>
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            label={`Cerrar sesión${user ? ` (${user.name})` : ""}`}
            onClick={() => logout()}
            c="red"
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
