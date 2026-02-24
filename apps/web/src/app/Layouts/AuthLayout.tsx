import { Container } from "@mantine/core";
import { FC } from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout: FC = () => {
  return (
    <Container size="xs" py="xl">
      <Outlet />
    </Container>
  );
};
