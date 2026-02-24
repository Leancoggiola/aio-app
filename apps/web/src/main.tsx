import { createTheme, MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AuthProvider } from "./app/auth";
import { SWRProvider } from "./app/providers";

import "@mantine/core/styles.css";

const THEME = createTheme({
  primaryColor: "primary",
  primaryShade: 6,
  defaultRadius: "md",
  autoContrast: true,
  colors: {
    primary: [
      "#FFECEF",
      "#FFD1D8",
      "#FCA3AF",
      "#F87487",
      "#F44D67",
      "#F63650",
      "#F63049",
      "#D02752",
      "#8A244B",
      "#111F35",
    ],
  },
});

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
