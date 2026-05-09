import { Loader, Center } from "@mantine/core";
import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

export const GuestRoute: FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
