import { Outlet } from "react-router-dom";
import { AppShell, Container } from "@mantine/core";

import { AnimatedBackground } from "./AnimatedBackground";

import type { FC } from "react";

export const AuthLayout: FC = () => {
  return (
    <AppShell padding="md">
      <AppShell.Main
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <AnimatedBackground />
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
