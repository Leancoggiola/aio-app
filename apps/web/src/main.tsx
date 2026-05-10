import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./app/core/auth";
import { SWRProvider } from "./app/core/providers";
import { router } from "./app/router";
import { THEME } from "./theme/config";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <MantineProvider theme={THEME}>
      <SWRProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SWRProvider>
    </MantineProvider>
  </StrictMode>,
);
