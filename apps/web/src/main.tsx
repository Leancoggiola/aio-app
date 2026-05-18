import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import { router } from '@/app/router';
import { AuthProvider } from '@/core/auth';
import { SWRProvider } from '@/core/providers';
import { THEME } from '@/theme/config';

import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <MantineProvider theme={THEME}>
      <SWRProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SWRProvider>
    </MantineProvider>
  </StrictMode>
);
