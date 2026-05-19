import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';

import { useAuth } from '../auth';

export const GuestRoute: FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
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
