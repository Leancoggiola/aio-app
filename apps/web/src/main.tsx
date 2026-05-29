import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';

import { router } from '@/app/router';
import { AuthProvider } from '@/core/auth';
import { SWRProvider } from '@/core/providers';
import { THEME } from '@/theme/config';
import { cssVariablesResolver } from '@/theme/css-variables';

import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'dayjs/locale/es';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <MantineProvider theme={THEME} cssVariablesResolver={cssVariablesResolver}>
      <DatesProvider settings={{ locale: 'es', firstDayOfWeek: 1 }}>
        <Notifications />
        <SWRProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </SWRProvider>
      </DatesProvider>
    </MantineProvider>
  </StrictMode>
);
